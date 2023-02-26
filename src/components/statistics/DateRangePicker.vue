<template>
    <div class="datepickers-container">
        <div class="datepicker-part-container">
            <label class="datepicker-switcher" onselectstart="return false" mousedown="return false">
                <input type="checkbox"
                    ref="useStartDateCheckbox"
                    :checked="useStartDate"
                    @click.prevent="$emit(`update:fromDate`, useStartDate ? null : tempState.fromDate)">
                from date
            </label>

            <vue-date-picker
                :model-value="tempState.fromDate.toSQL()"
                @update:model-value="useStartDate ? $emit(`update:fromDate`, DateTime.fromJSDate($event)) : null"
                class="filters-picker"
                format="yyyy-MM-dd"
                :max-date="useEndDate ? tempState.toDate.toSQL() : undefined"
                :clearable="false"
                :disabled="!useStartDate" />

        </div>

        <div class="datepicker-part-container">
            <label class="datepicker-switcher" onselectstart="return false" mousedown="return false">
                <input type="checkbox"
                    ref="useEndDateCheckbox"
                    :checked="useEndDate"
                    @click.prevent="$emit(`update:toDate`, useEndDate ? null : tempState.toDate)">
                to date
            </label>

            <vue-date-picker
                :model-value="tempState.toDate.toSQL()"
                @update:model-value="useEndDate ? $emit(`update:toDate`, DateTime.fromJSDate($event)) : null"
                class="filters-picker"
                format="yyyy-MM-dd"
                :min-date="useStartDate ? tempState.fromDate.toSQL() : undefined"
                :clearable="false"
                :disabled="!useEndDate" />

        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { DateTime } from 'luxon';
import { reactive, ref, watch, type PropType } from 'vue';

type TempState = {
    fromDate: DateTime,
    toDate: DateTime,
};

const props = defineProps({
    toDate: {
        required: true,
        type: null as unknown as PropType<DateTime | null>,
        // todo add check for datetime.timestamp less then another prop value (fromDate) if the last is not equals to null
        validator: (value) => DateTime.isDateTime(value) || value === null,
    },
    fromDate: {
        required: true,
        type: null as unknown as PropType<DateTime | null>,
        validator: (value) => DateTime.isDateTime(value) || value === null,
    },
});

defineEmits([`update:toDate`, `update:fromDate`]);


const tempState = reactive<TempState>({
    fromDate: DateTime.now().minus({ month: 3 }),
    toDate: DateTime.now(),
});

const useStartDateCheckbox = ref<HTMLInputElement>();
const useEndDateCheckbox = ref<HTMLInputElement>();

const useStartDate = computed(() => props.fromDate !== null);
const useEndDate = computed(() => props.toDate !== null);

watch(() => props.fromDate, (value: DateTime | null) => {
    if (DateTime.isDateTime(value)) {
        tempState.fromDate = DateTime.fromJSDate(value.toJSDate());
    }
    setTimeout(() => {
        (useStartDateCheckbox.value as HTMLInputElement).checked = useStartDate.value;
    });
});

watch(() => props.toDate, (value: DateTime | null) => {
    if (DateTime.isDateTime(value)) {
        tempState.toDate = DateTime.fromJSDate(value.toJSDate());
    }

    setTimeout(() => {
        (useEndDateCheckbox.value as HTMLInputElement).checked = useEndDate.value;
    });
});
</script>

<style scoped>
label {
    cursor: pointer;
}
.datepickers-container {
    display: flex;
}
.datepicker-part-container {
    width: 320px;
    display: flex;
}
.datepicker-part-container > .filters-picker {
    width: 200px;
}
.datepicker-part-container > .datepicker-switcher {
    margin-right: 15px;
}
</style>