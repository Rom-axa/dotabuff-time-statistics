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

            <logger-component ref="loggerComponent" />
        </div>
    </div>
</template>

<script lang="ts" setup="">
import { inject, onMounted, ref } from "@vue/runtime-core";
import ProgressBar from "@/views/ProgressBar.vue";
import {wait} from "@/utils";
import type { Game } from "@/types/Game";
import type { User } from "@/types/User";
import type GameRepository from "@/repositories/GameRepository";
import type UserRepository from "@/repositories/UserRepository";
import LoggerComponent from "./LoggerComponent.vue";
import type LoggerInterface from "./LoggerComponent";

type ProgressType = {
    taskTitle: string,
    result: number
}

const fileInput = ref<HTMLInputElement>();
const progress = ref<ProgressType | null>(null);
const gameRepository = inject(`gameRepository`) as GameRepository;
const userRepository = inject(`userRepository`) as UserRepository;
const loggerComponent = ref<LoggerInterface>();
const logger = (): LoggerInterface => loggerComponent.value as LoggerInterface;

const extractGames = async (file: File): Promise<Game[]> => {
    const content = await file.text();

    logger().info(`parsing file content`);

    let games: Game[];

    try {
        games = JSON.parse(content);
    } catch(error) {
        logger().warn(`Failed to parse content (invalid json)`);
        return [];
    }

    if (!(games instanceof Array)) {
        logger().warn(`invalid json structure`);
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
    logger().info(`filtered ${games.length - filteredGames.length} games`);

    games = filteredGames;

    if (games.length < 1) {
        return 0;
    }

    logger().info(`saving ${games.length} games`);

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

    logger().info(`saving ${users.length} users`);

    await userRepository.save(users);
    await wait(0.3);

    return users.length;
};

const handleFile = async (file: File): Promise<void> => {
    logger().info(`starting to process file ${file.name}`);

    progress.value = {
        taskTitle: `Processing file ${file.name}`,
        result: 0,
    };

    try {
        await wait(0.5);
        const games = await extractGames(file);

        if (games.length < 1) {
            logger().warn(`skipping process ${file.name} (no games in file)`);
            return;
        }

        const savedGamesQty = await saveGames(games);

        if (savedGamesQty < 1) {
            logger().warn(`skipping ${file.name} (no games to save)`);
            return;
        }

        logger().success(`successfully saved ${savedGamesQty} new games`);

        const savedUsersQty = await extractAndSaveUniqueUsers(games, progress.value);

        if (savedUsersQty> 0) {
            logger().success(`successfully saved ${savedUsersQty} new users`);
        }
    } catch (error) {
        logger().error(`unexpected error was occurred`, error);
    } finally {
        logger().info(`finished process ${file.name}`);
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
            logger().debug(`no files in input element`);
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