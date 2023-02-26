<template>
    <div class="container" style="padding-bottom: 100px;">
        <h1 class="text-center">How to extract games from dotabuff.com ?</h1>

        <h2>Step 1</h2>
        <p>
            <span>Copy js script to clipboard</span>
            <button type="button" class="btn btn-success" style="margin-left: 20px" @click="listOfScripts?.copyMainScript()">copy</button>
        </p>
        <list-of-scripts ref="listOfScripts" />

        <hr>

        <h2>Step 2</h2>
        <p>
            Go to <a href="https://dotabuff.com" target="_blank" class="default-link">dotabuff.com</a>
        </p>

        <hr>

        <h2>Step 3</h2>
        <p>Open browser devtools (ctrl + shift + i)</p>
        <img src="@/assets/images/dotabuff1.png" style="max-width: 100%;">

        <hr>

        <h2>Step 4</h2>
        <p>Paste copied previously script and press enter (ctrl + v | enter)</p>
        <p>After that you should see modal window where you will be able to downloading user games by account id</p>

        <img src="@/assets/images/dotabuff2.png" style="max-width: 100%;">
    </div>
</template>

<script lang="ts" setup>
import ListOfScripts from '@/components/ListOfScripts.vue';
import type ListOfScriptsComponentInterface from '@/components/ListOfScripts';
import { ref } from 'vue';
 
const listOfScripts = ref<ListOfScriptsComponentInterface>();
</script>