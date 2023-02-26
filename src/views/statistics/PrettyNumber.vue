<template>
    <span>{{ pretty }}</span>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { chunk } from '@/utils';

const props = defineProps({
    value: {
        required: true,
        type: Number,
    }
});

const pretty = computed(() => (
    (([beforeDot, afterDot]) => (
        ((prettyBeforeDot) => afterDot != undefined
            ? `${prettyBeforeDot}.${afterDot}`
            : prettyBeforeDot
        )(
            chunk(beforeDot.split(``).reverse(), 3)
                .map(val => [...val, ` `].reverse().join(``))
                .reverse()
                .join(``)
                .trim()
        )
    ))(props.value.toString().split(`.`))
));
</script>