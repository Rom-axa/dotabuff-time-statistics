<template>
    <table>
        <tbody>
            <tr>
                <td>
                    approximate time
                </td>
                <td>
                    <pretty-seconds :value="report.approximateTimeInDota" />
                </td>
            </tr>
            <tr>
                <td>
                    actual time
                </td>
                <td>
                    <pretty-seconds :value="report.timeInGames" />
                </td>
            </tr>
            <tr>
                <td>
                    all games
                </td>
                <td>
                    <pretty-number :value="report.allGames" />
                </td>
            </tr>
            <tr>
                <td>
                    won games
                </td>
                <td>
                    <value-with-percent :value="report.wonGames" value-css-class="text-success" />
                </td>
            </tr>
            <tr>
                <td>
                    lost games
                </td>
                <td>
                    <value-with-percent :value="report.lostGames" value-css-class="text-danger" />
                </td>
            </tr>
            <tr>
                <td>
                    abandoned games
                </td>
                <td>
                    <value-with-percent :value="report.abandonedGames" value-css-class="text-warning" />
                </td>
            </tr>
            <tr>
                <td>
                    trueSighted games
                </td>
                <td>
                    <value-with-percent :value="report.trueSightedGames" />
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts" setup>
import type { Report } from '@/types/statistics/Report';
import type { PropType } from 'vue';
import ValueWithPercent from './ValueWithPercent.vue';
import PrettySeconds from './PrettySeconds.vue';
import PrettyNumber from './PrettyNumber.vue';

defineProps({
    report: {
        required: true,
        type: Object as PropType<Report>,
    }
});
</script>

<style scoped>
table {
    border-spacing: 0;
}
td {
    border: 1px solid var(--light-secondary);
    border-bottom: 0;
    padding: 10px;
}
td:first-child {
    border-right: 0;
}
tr:last-child > td {
    border-bottom: 1px solid var(--light-secondary);
}
</style>