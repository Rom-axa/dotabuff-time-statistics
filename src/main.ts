import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia());
app.use(router);

// indexed db
import type DatabaseInterface from 'simple-wrap-indexed-db/dist/Contracts/DatabaseInterface';
import database, { Storages } from '@/database';
import GameRepository from '@/repositories/GameRepository';
import UserRepository from '@/repositories/UserRepository';

const gameRepository = new GameRepository(database.storage(Storages.Games));
const userRepository = new UserRepository(database.storage(Storages.Users));

app.provide<DatabaseInterface>(`database`, database);
app.provide<GameRepository>(`gameRepository`, gameRepository);
app.provide<UserRepository>(`userRepository`, userRepository);

// datepicker
import '@vuepic/vue-datepicker/dist/main.css';
import VueDatePicker from '@vuepic/vue-datepicker';
app.component(`VueDatePicker`, VueDatePicker);

// vue-multiselect
import 'vue-multiselect/dist/vue-multiselect.css';
import Multiselect from 'vue-multiselect';
app.component(`VueMultiselect`, Multiselect);

// highlight.js
import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage(`javascript`, javascript);

// swall
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
app.use(VueSweetalert2);

import '@/assets/index.css'

app.mount('#app')
