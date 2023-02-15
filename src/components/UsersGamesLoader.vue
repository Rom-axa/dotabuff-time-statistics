<template>
    <div class="main-panel">
        <div class="main-panel__content">
            <h1>
                Put game files here
            </h1>

            <div>
                <input type="file" ref="fileInput" accept="application/JSON" multiple>
            </div>

            <progress-bar v-if="progress !== null" :result="progress.result" class="mt-5">
                {{ progress.taskTitle }}
            </progress-bar>
            
            <div class="logs-container mt-5" ref="logsContainer">
                <alert-view v-for="(record, key) in logs" :key="key" :type="record.type" class="mt-5">
                    {{ record.text }}
                </alert-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup="">
import { inject, onMounted, ref } from "@vue/runtime-core";
import AlertView from "@/views/AlertView.vue";
import ProgressBar from "@/views/ProgressBar.vue";
import {wait} from "@/utils";
import type { Game } from "@/types/Game";
import type { User } from "@/types/User";
import type GameRepository from "@/repositories/GameRepository";
import type UserRepository from "@/repositories/UserRepository";

enum LogType {
    SUCCESS = `success`,
    INFO = `info`,
    WARNING = `warning`,
    DANGER = `danger`,
    DEBUG = `debug`,
}

type RecordLog = {
    text: string,
    type: LogType
}
type ProgressType = {
    taskTitle: string,
    result: number
}

const fileInput = ref<HTMLInputElement>();
const logs = ref<RecordLog[]>([]);
const logsContainer = ref<HTMLDivElement>();
const progress = ref<ProgressType | null>(null);
const gameRepository = inject(`gameRepository`) as GameRepository;
const userRepository = inject(`userRepository`) as UserRepository;

const log = (type: LogType, text: string, ...otherParams: any[]): void => {
    logs.value.push({ type, text });

    switch (type) {
        case LogType.SUCCESS:
        case LogType.INFO:
            console.info(text, ...otherParams);
            break;
        case LogType.WARNING:
            console.warn(text, ...otherParams);
            break;
        case LogType.DANGER:
            console.error(text, ...otherParams);
            break;
        default:
            console.debug(text, ...otherParams);
    }
    
    wait(0).then(() => {
        if (logsContainer.value === undefined) {
            return;
        }

        logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
    });
};

const extractGames = async (file: File): Promise<Game[]> => {
    const content = await file.text();

    log(LogType.INFO, `parsing file content`);

    let games: Game[];

    try {
        games = JSON.parse(content);
    } catch(error) {
        log(LogType.WARNING, `Failed to parse content (invalid json)`);
        return [];
    }

    if (!(games instanceof Array)) {
        log(LogType.WARNING, `invalid json structure`);
        return [];
    }

    return games;
}

const saveGames = async (games: Game[]): Promise<number> => {
    const persistentGamesIds: string[] = [];

    for await (const gameId of gameRepository.getIds()) {
        persistentGamesIds.push(gameId);
    }

    const filteredGames = games.filter(game => !persistentGamesIds.includes(game.id));

    await wait(0.15);
    log(LogType.INFO, `filtered ${games.length - filteredGames.length} games`);

    games = filteredGames;

    if (games.length < 1) {
        return 0;
    }

    log(LogType.INFO, `saving ${games.length} games`);

    await gameRepository.save(games);
    await wait(0.3);

    return games.length;
};

const extractAndSaveUniqueUsers = async (games: Game[], progress: ProgressType): Promise<number> => {
    const persistentUsersIds = await userRepository.getIds();
    const usersList: {[userId: string]: User} = {};

    for (let [index, game] of Object.entries(games)) {
        // fore pretty displaying process bar
        if (parseInt(index) % 100 === 0) {
            await wait(0.1);
        }

        progress.result = parseFloat((((+index + 1) * 100) / games.length).toFixed(1));

        if (game?.user?.id !== undefined && game.user.id in usersList === false) {
            usersList[game.user.id] = game.user;
        }
    }

    const users = Object.values(usersList).filter(user => !persistentUsersIds.includes(user.id));

    if (users.length < 1) {
        return 0;
    }

    log(LogType.INFO, `saving ${users.length} users`);

    await userRepository.save(users);
    await wait(0.3);

    return users.length;
};

const handleFile = async (file: File): Promise<void> => {
    log(LogType.INFO, `starting to process file ${file.name}`);

    progress.value = {
        taskTitle: `Processing file ${file.name}`,
        result: 0,
    };

    try {
        await wait(0.5);
        const games = await extractGames(file);

        if (games.length < 1) {
            log(LogType.WARNING, `skipping process ${file.name} (no games in file)`);
            return;
        }

        const savedGamesQty = await saveGames(games);

        if (savedGamesQty < 1) {
            log(LogType.WARNING, `skipping ${file.name} (no games to save)`);
            return;
        }

        log(LogType.SUCCESS, `successfully saved ${savedGamesQty} new games`);

        const savedUsersQty = await extractAndSaveUniqueUsers(games, progress.value);

        if (savedUsersQty> 0) {
            log(LogType.SUCCESS, `successfully saved ${savedUsersQty} new users`);
        }

    } catch (error) {
        log(LogType.DANGER, `unexpected error was occurred`, error);
    } finally {
        log(LogType.INFO, `finished process ${file.name}`);
        progress.value = null;
    }
};

onMounted(() => {
    if (fileInput?.value === undefined) {
        console.warn(`not ref input`);
        return;
    }

    fileInput.value.onchange = (event: Event) => {
        const files = fileInput.value?.files ?? null;
        
        if (files === null) {
            log(LogType.DEBUG, `no files in input element`);
            return;
        }

        let start = (value: unknown) => {};
        let promise = new Promise(resolve => start = resolve);
        
        Array.from(files).forEach(file => {
            promise = promise.then(() => handleFile(file))
        });

        start(null);
    };
})
</script>

<style scoped>
.main-panel {
    min-width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.main-panel > .main-panel__content {
    border: 1px solid lightgray;
    padding: 50px;
}

.logs-container {
    max-height: 200px;
    overflow-y: scroll;
}
</style>