import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Filters } from '@/types/statistics/Filters';
import { useFiltersStore } from "./filters";
import { useUsersStore } from '../users';
import { useHeroesStore } from '../heroes';

export const useStatisticsStore = defineStore(`statistics`, () => {
    const filtersStore = useFiltersStore();
    
    const filters = computed(() => ({
        form: filtersStore.form,
        reset: filtersStore.reset
    }));

    const usersStore = useUsersStore();

    const users = computed(() => ({
        list: usersStore.list,
        fetching: usersStore.fetching,
        fetch: usersStore.fetch,
    }));

    const heroesStore = useHeroesStore();

    const heroes = computed(() => ({
        list: heroesStore.list,
        fetching: heroesStore.fetching,
        fetch: heroesStore.fetch,
    }));

    const searching = ref(false);


    return { searching, filters, users, heroes }
})