<template>
    <vue-multiselect
        :model-value="modelValue"
        @update:model-value="$emit(`update:modelValue`, $event)"
        :label="'name'"
        :options="users"
        :searchable="true"
        :close-on-select="false"
        :multiple="true"
        class="multiselect--hide-selected"
        track-by="id"
        placeholder="Choose accounts">
        <template #clear="props">
            <div class="multiselect__clear" v-if="modelValue.length" @mousedown.prevent.stop="$emit(`update:modelValue`, [])"></div>
        </template>
    </vue-multiselect>
</template>

<script lang="ts" setup>
import type { User } from '@/types/User';
import type { PropType } from 'vue';

defineProps({
    modelValue: {
        required: true,
        type: Array as PropType<User[]>,
    },
    users: {
        type: Array as PropType<User[]>,
    }
})
defineEmits(['update:modelValue']);
</script>