<template>
    <div>
        <label>
            <input
                type="radio"
                @input="$emit('update:modelValue', GamesPlayersQty.solo)"
                :checked="modelValue === GamesPlayersQty.solo"
                :name="`game-players-qty-${suffix}`"
                :value="GamesPlayersQty.solo">

            solo
        </label>
        <label>
            <input
                type="radio"
                @input="$emit('update:modelValue', GamesPlayersQty.party)"
                :checked="modelValue === GamesPlayersQty.party"
                :name="`game-players-qty-${suffix}`"
                :value="GamesPlayersQty.party">

            party
        </label>
        <label>
            <input
                type="radio"
                @input="$emit('update:modelValue', GamesPlayersQty.all)"
                :checked="modelValue === GamesPlayersQty.all"
                :name="`game-players-qty-${suffix}`"
                :value="GamesPlayersQty.all">

            all
        </label>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import {randomString} from "@/utils";
import {GamesPlayersQty} from "@/types/statistics/Filters";

const suffix = randomString(7);

defineProps({
    modelValue: {
        required: true,
        type: Number as PropType<GamesPlayersQty>,
    }
});
defineEmits(['update:modelValue']);
</script>