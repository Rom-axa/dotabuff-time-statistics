<template>
    <form action="" @submit.prevent="$emit(`submit`)" class="filters-container">
        <div class="filters-panel">
            <div class="filters-row">
                <date-range-picker  v-model:from-date="model.fromDate" v-model:to-date="model.toDate" />

                <div class="filters-cell">
                    <label>
                        <input type="checkbox" v-model="model.isRating">
                        rating
                    </label>
                </div>

                <div class="filters-cell">
                    <game-players-qty-radio v-model="model.gamePlayersQty" />
                </div>
            </div>

            <div class="filters-row">
                <div class="filters-select-container">
                    <users-accounts-select v-model="model.selectedUsers" :users="users" />
                </div>
                
                <div class="filters-select-container">
                    <game-mode-select v-model="model.gamesModes" />
                </div>

                <div class="filters-select-container">
                    <heroes-select v-model="model.selectedHeroes" :heroes="heroes" />
                </div>
            </div>
        </div>

        <div class="filters-separator"></div>

        <div class="filters-control-panel">
            <button type="submit" class="btn btn-success">
                Search
            </button>

            <button type="button" class="btn btn-secondary" @click="$emit(`reset`)">
                Reset
            </button>
        </div>
    </form>

</template>

<script lang="ts" setup>
// TODO remember in http query on submit
import type { PropType } from 'vue';
import type { User } from '@/types/User';
import type { Filters } from '@/types/statistics/Filters';
import UsersAccountsSelect from './UsersAccountsSelect.vue';
import GamePlayersQtyRadio from './GamePlayersQtyRadio.vue';
import DateRangePicker from './DateRangePicker.vue';
import HeroesSelect from './HeroesSelect.vue';
import GameModeSelect from './GameModeSelect.vue';

defineEmits([`submit`, `reset`]);

const props = defineProps({
    modelValue: {
        required: true,
        type: Object as PropType<Filters>,
    },
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
    disabled: {
        required: false,
        type: Boolean,
        default: false,
    }
});

const model = props.modelValue;
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

</style>