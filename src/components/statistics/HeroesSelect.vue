<template>
    <vue-multiselect
        :model-value="modelValue"
        @update:model-value="$emit(`update:modelValue`, $event)"
        :options="heroes"
        :searchable="true"
        :close-on-select="false"
        :multiple="true"
        class="multiselect--hide-selected"
        placeholder="Choose heroes">
        <template #clear="props">
            <div class="multiselect__clear" v-if="modelValue.length" @mousedown.prevent.stop="$emit(`update:modelValue`, [])"></div>
        </template>
    </vue-multiselect>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';

defineProps({
    modelValue: {
        required: true,
        type: Array as PropType<string[]>,
    },
    heroes: {
        required: true,
        type: Array as PropType<string[]>,
    }
})
defineEmits(['update:modelValue']);
</script>