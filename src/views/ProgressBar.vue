<template>
    <div class="progress-bar">
        <div>
            <slot>{{ title }}</slot>
        </div>
        <div class="progress-bar__ready" :style="{ width: `${result}%` }"></div>
    </div>
</template>

<script lang="ts" setup>
import {defineProps} from 'vue';

defineProps({
    result: {
        type: Number,
    },
    title: {
        type: String,
        required: false,
    }
});
</script>

<style scoped>
.progress-bar > .progress-bar__ready {
    background-color: var(--info);
    height: 10px;
}
</style>