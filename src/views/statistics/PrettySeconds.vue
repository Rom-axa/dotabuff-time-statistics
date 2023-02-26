<template>
    <span :title="`${props.value} seconds`">
        <pretty-number :value="hours" /> h.
    </span>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import PrettyNumber from './PrettyNumber.vue';

const props = defineProps({
    value: {
        required: true,
        type: Number,
    }
});

const hours = computed(() => props.value <= 0 ? props.value : parseFloat((props.value / 3600).toFixed(0)));
</script>