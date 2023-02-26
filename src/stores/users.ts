import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import type UserRepository from '@/repositories/UserRepository';
import type { User } from '@/types/User';

export const useUsersStore = defineStore(`users`, () => {
    const userRepository = inject(`userRepository`) as UserRepository;

    const list = ref<User[]>([]);
    const fetching = ref<boolean>(false);

    const fetch = async () => {
        try {
            fetching.value = true;

            list.value.splice(0, Infinity, ...(await userRepository.findAll()));
        } finally {
            fetching.value = false;
        }
    };

    return { list, fetching, fetch }
});