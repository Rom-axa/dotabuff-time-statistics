<template>
    <div class="logs-container mt-5" ref="logsContainer">
        <alert-view v-for="(record, key) in logs" :key="key" :type="record.type" class="mt-5">
            {{ record.text }}
        </alert-view>
    </div>
</template>

<script lang="ts" setup>
import { wait } from '@/utils';
import { ref } from 'vue';
import AlertView from "@/views/AlertView.vue";

enum LogType {
    SUCCESS = `success`,
    INFO = `info`,
    WARNING = `warning`,
    DANGER = `danger`,
    DEBUG = `debug`,
}
type RecordLog = {
    text: string,
    type: LogType
}

const logs = ref<RecordLog[]>([]);
const logsContainer = ref<HTMLDivElement>();

const log = (type: LogType, text: string, ...otherParams: any[]): void => {
    logs.value.push({ type, text });

    switch (type) {
        case LogType.SUCCESS:
        case LogType.INFO:
            console.info(text, ...otherParams);
            break;
        case LogType.WARNING:
            console.warn(text, ...otherParams);
            break;
        case LogType.DANGER:
            console.error(text, ...otherParams);
            break;
        default:
            console.debug(text, ...otherParams);
    }
    
    wait(0).then(() => {
        if (logsContainer.value === undefined) {
            return;
        }

        logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
    });
};

defineExpose({
    debug(message: string, ...otherParams: any[]): void {
        log(LogType.DEBUG, message, ...otherParams);
    },
    info(message: string, ...otherParams: any[]): void {
        log(LogType.INFO, message, ...otherParams);
    },
    warn(message: string, ...otherParams: any[]): void {
        log(LogType.WARNING, message, ...otherParams);
    },
    error(message: string, ...otherParams: any[]): void {
        log(LogType.DANGER, message, ...otherParams);
    },
    success(message: string, ...otherParams: any[]): void {
        log(LogType.SUCCESS, message, ...otherParams);
    },
});
</script>