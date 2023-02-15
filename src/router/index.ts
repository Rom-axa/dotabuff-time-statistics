import { createRouter, createWebHistory } from 'vue-router'
// import MainPanel from '@/components/MainPanel.vue'
import UsersGamesLoader from '@/components/UsersGamesLoader.vue'
import StatisticsComponent from '@/components/StatisticsComponent.vue'

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
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
