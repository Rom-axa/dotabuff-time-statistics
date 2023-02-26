import { createRouter, createWebHistory } from 'vue-router';
import UsersGamesLoader from '@/components/UsersGamesLoader.vue';
import StatisticsComponent from '@/components/StatisticsComponent.vue';
import InstructionComponent from '@/components/InstructionComponent.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: UsersGamesLoader
        },
        {
            path: '/statistics',
            name: 'statistics',
            component: StatisticsComponent
        },
        {
            path: '/instruction',
            name: 'instruction',
            component: InstructionComponent
        },
    ]
})

export default router
