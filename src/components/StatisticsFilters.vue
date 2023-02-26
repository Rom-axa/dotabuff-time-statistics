<template>
    <form action="" @submit.prevent="submit" class="filters-container">
        <div class="filters-panel">
            <div class="filters-row">
                <date-range-picker v-model:from-date="tempState.fromDate" v-model:to-date="tempState.toDate" />

                <div class="filters-cell">
                    <label>
                        <input type="checkbox" v-model="tempState.isRating">
                        rating
                    </label>
                </div>

                <div class="filters-cell">
                    <game-players-qty-radio v-model="tempState.gamePlayersQty" />
                </div>
            </div>

            <div class="filters-row">
                <div class="filters-select-container">
                    <users-accounts-select v-model="tempState.selectedUsers" :users="users" />
                </div>
                
                <div class="filters-select-container">
                    <game-mode-select v-model="tempState.gamesModes" />
                </div>

                <div class="filters-select-container">
                    <heroes-select v-model="tempState.selectedHeroes" :heroes="heroes" />
                </div>
            </div>
        </div>

        <div class="filters-separator"></div>

        <div class="filters-control-panel">
            <button class="filters-button filters-button-search" @click="submit">
                Search
            </button>

            <button class="filters-button filters-button-reset" @click="reset">
                Reset
            </button>
        </div>
    </form>

</template>

<script lang="ts" setup>
// TODO remember in http query on submit
import UsersAccountsSelect from './statistics/UsersAccountsSelect.vue';
import GamePlayersQtyRadio from './statistics/GamePlayersQtyRadio.vue';
import DateRangePicker from './statistics/DateRangePicker.vue';
import HeroesSelect from './statistics/HeroesSelect.vue';
import GameModeSelect from './statistics/GameModeSelect.vue';
import type { DateTime } from 'luxon';
import { reactive, type PropType } from 'vue';
import type { User } from '@/types/User';
import type { GameModes } from '@/types/statistics/Filters';

type TempState = {
    fromDate: DateTime | null,
    toDate: DateTime | null,
    isRating: boolean,
    selectedUsers: User[],
    gamesModes: GameModes[],
    gamePlayersQty: number,
    selectedHeroes: string[],
}

defineProps({
    users: {
        required: true,
        type: Array as PropType<User[]>,
    },
    usersAreLoading: {
        required: false,
        type: Boolean,
        default: false,
    },
    heroes: {
        required: true,
        type: Array as PropType<string[]>,
    },
    heroesAreLoading: {
        required: false,
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits([`submit`]);

const makeEmptyForm = (): TempState => ({
    fromDate: null,
    toDate: null,
    isRating: false,
    selectedUsers: [],
    gamesModes: [],
    gamePlayersQty: 0,
    selectedHeroes: [],
});

const tempState = reactive<TempState>(makeEmptyForm());

const submit = () => emit(`submit`, {...tempState});
const reset = () => Object.assign(tempState, makeEmptyForm());
</script>

<style scoped>
.filters-container {
    display: flex;
    width: 1200px;
    padding: 5px;
}
.filters-panel {
    width: 1000px;
    display: flex;
    flex-direction: column;
}
.filters-panel > .filters-row {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

.filters-select-container {
    width: 300px;
    display: flex;
}

.filters-cell {
    display: flex;
    align-items: center;
}

/* .datepickers-container {
    display: flex;
}
.datepicker-part-container {
    width: 320px;
    display: flex;
}
.datepicker-part-container > .filters-picker {
    width: 200px;
}
.datepicker-part-container > .datepicker-switcher {
    margin-right: 15px;
} */

.filters-container > .filters-separator {
    border-right: 1px solid var(--secondary);
    margin: 0 50px;
}

.filters-container > .filters-separator, .filters-container > .filters-control-panel {
    height: 100px;
}

.filters-container > .filters-control-panel {
    display: flex;
    align-items: start;
    flex-direction: column;
    justify-content: space-around;
}

.filters-container > .filters-control-panel > .filters-button {
    background-color: white;
    padding: 8px;
    font-size: 16px;
    min-width: 100px;
}
.filters-container > .filters-control-panel > .filters-button:hover {
    cursor: pointer;
}
.filters-container > .filters-control-panel > .filters-button:active {
    color: white;
}

.filters-container > .filters-control-panel > .filters-button.filters-button-search {
    border: 1px solid var(--success);
}
.filters-container > .filters-control-panel > .filters-button.filters-button-reset {
    border: 1px solid var(--secondary);
}
.filters-container > .filters-control-panel > .filters-button.filters-button-search:hover {
    background-color: var(--light-success);
}
.filters-container > .filters-control-panel > .filters-button.filters-button-search:active {
    background-color: var(--success);
    color: white;
}
.filters-container > .filters-control-panel > .filters-button.filters-button-reset:hover {
    background-color: var(--light-secondary);
}
.filters-container > .filters-control-panel > .filters-button.filters-button-reset:active {
    background-color: var(--secondary);
}
</style>