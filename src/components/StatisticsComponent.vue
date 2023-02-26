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
        
        <div class="mt-50">
            <template v-for="(report, index) in state.reports" :key="index">
                <statistics-report :report="report" />
            </template>
        </div>
        
    </div>
</template>

<script lang="ts" setup>
import FiltersComponent from './statistics/FiltersForm.vue';
import { useStatisticsStore } from '@/stores/statistics/statistics';
import { onMounted } from 'vue';
import StatisticsReport from '@/views/statistics/StatisticsReport.vue';

const state = useStatisticsStore();

onMounted(() => {
    Promise.all([
        state.users.fetch(),
        state.heroes.fetch(),
    ]);
});

const handleSubmit = () => {
    state.search();
};
</script>

<style scoped>
</style>