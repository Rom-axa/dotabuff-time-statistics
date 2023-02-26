<template>
    <div>
        <div ref="slotValue" style="display: none">
            <slot></slot>
        </div>

        <v-highlightjs :code="code" lang="js" style="margin: 0;"></v-highlightjs>
    </div>
</template>

<script lang="ts" setup>
import hljsVuePlugin from "@highlightjs/vue-plugin";
import { onMounted, ref } from 'vue';

const props = defineProps({
    ident: {
        type: Number,
        default: 4,
    },
    startFromLine: {
        type: Number,
        default: 1,
    },
    endOnLine: {
        type: Number,
        default: 1,
    },
});

const VHighlightjs = hljsVuePlugin.component;

const code = ref(``);
const slotValue = ref();

onMounted(() => {
    const scriptText = slotValue.value.innerHTML
        .trim()
        .split(`\n`)
        .splice(props.startFromLine)
        .reverse()
        .splice([props.endOnLine])
        .reverse()
        .map((part: string) => part.replace(new RegExp(`^ {0,${props.ident}}`), ''))
        .join(`\n`);

    code.value = scriptText;
});

defineExpose({
    getCode(): string {
        return code.value;
    },
});
</script>