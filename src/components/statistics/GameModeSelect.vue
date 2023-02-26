<template>
    <vue-multiselect
        :model-value="modelValue"
        @update:model-value="$emit(`update:modelValue`, $event)"
        :options="modes"
        :searchable="true"
        :close-on-select="false"
        :multiple="true"
        class="multiselect--hide-selected"
        placeholder="Choose game modes">
        <template #clear="props">
            <div class="multiselect__clear" v-if="modelValue.length" @mousedown.prevent.stop="$emit(`update:modelValue`, [])"></div>
        </template>
    </vue-multiselect>
</template>

<script lang="ts" setup>
import {GameModes} from "@/types/statistics/Filters";
import type { PropType } from "vue";

defineProps({
    modelValue: {
        required: true,
        type: Array as PropType<GameModes[]>,
    },
    modes: {
        required: false,
        type: Array,
        default: [
            GameModes.allPick,
            GameModes.turbo,
            GameModes.singleDraft,
            GameModes.other,
        ],
    }
})
defineEmits(['update:modelValue']);
</script>