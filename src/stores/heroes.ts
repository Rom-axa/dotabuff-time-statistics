import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import type GameRepository from '@/repositories/GameRepository';

export const useHeroesStore = defineStore(`heroes`, () => {
    const gameRepository = inject(`gameRepository`) as GameRepository;

    const list = ref<string[]>([]);
    const fetching = ref<boolean>(false);

    const fetchHeroes = async () => {
        try {
            fetching.value = true;

            list.value.splice(0, Infinity, ...(await gameRepository.findUniqueHeroes()));
        } finally {
            fetching.value = false;
        }
    }; 

    return { list, fetching, fetchHeroes }
});