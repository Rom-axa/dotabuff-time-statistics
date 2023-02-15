<template>
    <div :class="[`alert`, `alert-${type}`]">
        <slot>{{ content }}</slot>
    </div>
</template>

<script lang="ts" setup="">
import {defineProps} from 'vue';

defineProps({
    type: {
        type: String,
        validate: (param: any) => ['success', 'info', 'warning', 'danger'].includes(param)
    },
    content: {
        type: String,
        required: false,
        default: ``,
    }
});

</script>

<style scoped>
    .alert {
        padding: 5px;
        padding-left: 10px;
    }
    .alert.alert-success {
        color: var(--success);
        background-color: var(--light-success);
    }
    .alert.alert-info {
        color: var(--info);
        background-color: var(--light-info);
    }
    .alert.alert-warning {
        color: var(--warning);
        background-color: var(--light-warning);
    }
    .alert.alert-danger {
        color: var(--danger);
        background-color: var(--light-danger);
    }
</style>