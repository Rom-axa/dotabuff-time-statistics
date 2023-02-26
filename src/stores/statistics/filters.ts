import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Filters } from '@/types/statistics/Filters';

export const useFiltersStore = defineStore(`filters`, () => {
    const makeEmptyForm = (): Filters => ({
        fromDate: null,
        toDate: null,
        isRating: false,
        selectedUsers: [],
        gamesModes: [],
        gamePlayersQty: 0,
        selectedHeroes: [],
    });

    const form = reactive(makeEmptyForm());

    const reset = () => Object.assign(form, makeEmptyForm());

    // const state = reactive({
    //     form: makeEmptyForm(),
    // });

    // const count = ref(0)
    // const doubleCount = computed(() => count.value * 2);

    // function increment() {
        // count.value++
    // }

    return { form, reset };
})