import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/assets/main.css'
import database, { Storages } from '@/database'
import type DatabaseInterface from 'simple-wrap-indexed-db/dist/Contracts/DatabaseInterface'
import GameRepository from '@/repositories/GameRepository'
import UserRepository from '@/repositories/UserRepository'

const gameRepository = new GameRepository(database.storage(Storages.Games));
const userRepository = new UserRepository(database.storage(Storages.Users));
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide<DatabaseInterface>(`database`, database);
app.provide<GameRepository>(`gameRepository`, gameRepository);
app.provide<UserRepository>(`userRepository`, userRepository);

app.mount('#app')
