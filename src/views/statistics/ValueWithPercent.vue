<template>
    <span>
        <pretty-number :class="valueCssClass" :value="value.value"/>

        <span class="text-secondary">
            ({{ value.percent.toFixed(2) }} %)
        </span>
    </span>
</template>

<script lang="ts" setup>
import type { QtyWithPercent } from '@/types/statistics/Report';
import type { PropType } from 'vue';
import PrettyNumber from './PrettyNumber.vue';

defineProps({
    value: {
        required: true,
        type: Object as PropType<QtyWithPercent>,
    },
    valueCssClass: {
        type: String,
        default: `text-dark`,
    }
})
</script>