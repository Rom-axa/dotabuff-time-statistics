<template>
    <main>
        <header>
            <nav>
                <router-link class="nav-link" to="/statistics">
                    statistics
                </router-link>

                <router-link class="nav-link" to="/">
                    load
                </router-link>
            </nav>
        </header>

        <router-view />

        <footer></footer>
    </main>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
    header > nav {
        display: flex;
        width: 1000px;
        margin: 0 auto;
        justify-content: center;
        padding-top: 15px;
    }

    header > nav .nav-link {
        text-decoration: none;
        margin-right: 15px;
        margin-left: 15px;
    }
</style>