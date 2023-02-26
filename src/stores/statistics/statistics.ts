import { ref, computed, reactive, inject } from 'vue'
import { defineStore } from 'pinia'
import { useFiltersStore } from "./filters";
import { useUsersStore } from '../users';
import { useHeroesStore } from '../heroes';
import type GameRepository from '@/repositories/GameRepository';
import type { Report } from '@/types/statistics/Report';

export const useStatisticsStore = defineStore(`statistics`, () => {
    const gameRepository = inject(`gameRepository`) as GameRepository;

    const filtersStore = useFiltersStore();
    const usersStore = useUsersStore();
    const heroesStore = useHeroesStore();
    
    const filters = computed(() => ({
        form: filtersStore.form,
        reset: filtersStore.reset
    }));

    const users = computed(() => ({
        list: usersStore.list,
        fetching: usersStore.fetching,
        fetch: usersStore.fetch,
    }));

    const heroes = computed(() => ({
        list: heroesStore.list,
        fetching: heroesStore.fetching,
        fetch: heroesStore.fetch,
    }));

    const searching = ref(false);
    const reports = ref<Report[]>([]);

    const search = async (): Promise<void> => {
        try {
            searching.value = true;
            
            const report = await gameRepository.findStatistics(filters.value.form);

            reports.value.splice(0, Infinity, report);
        } catch(error) {

        } finally {
            searching.value = false;
        }
    };

    return { searching, filters, reports, search, users, heroes }
})