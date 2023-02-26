<template>
    <div class="container">
        <filters-component
            v-model="state.filters.form"
            :users="state.users.list"
            :users-are-loading="state.users.fetching"
            :heroes="state.heroes.list"
            :heroes-are-loading="state.heroes.fetching"
            :disabled="state.searching"
            @submit="handleSubmit"
            @reset="state.filters.reset()" />
        
        
    </div>
</template>

<script lang="ts" setup>
import FiltersComponent from './statistics/FiltersForm.vue';
import { useStatisticsStore } from '@/stores/statistics/statistics';
import { onMounted } from 'vue';

const state = useStatisticsStore();

onMounted(() => {
    Promise.all([
        state.users.fetch(),
        state.heroes.fetch(),
    ]);
});

const handleSubmit = (...a: any) => {
    console.log(`handleSubmit!`, a);

    alert();
}

</script>

<style scoped>
.container {
    margin: 0 auto;
    width: 1300px;
}
</style>