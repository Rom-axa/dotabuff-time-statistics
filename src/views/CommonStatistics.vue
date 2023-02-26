<template>
    <table>
        <tbody>
            <tr>
                <td style="vertical-align: top">
                    Approximate: <b>{{ hours(statistics.approximateTimeInDota) }}</b>
                </td>
                <td style="vertical-align: top">
                    Hours: <b>{{ hours(statistics.timeInGames.all.all.seconds) }}</b>
                </td>
                <td>
                    <span>Games:</span>
                    <b>{{ statistics.allGames.all.all }}</b>
                    <br>

                    <span>Won:</span>
                    <b>{{ statistics.wonGames.all.all.value }}</b>
                    <span> ({{ statistics.wonGames.all.all.percent }} %)</span>
                    <br>

                    <span>Lost:</span>
                    <b>{{ statistics.lostGames.all.all.value }}</b>
                    <span> ({{ statistics.lostGames.all.all.percent }} %)</span>
                    <br>
                    
                    <span>Abandoned:</span>
                    <b>{{ statistics.abandonedGames.all.all.value }}</b>
                    <span> ({{ statistics.abandonedGames.all.all.percent }} %)</span>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts" setup>
import type { CommonStatistics } from '@/types/CommonStatistics';
import type { PropType } from 'vue';

defineProps({
    statistics: {
        type: Object as PropType<CommonStatistics>,
        required: true,
    }
});

const hours = (seconds: number): number => Math.floor(seconds / 3600);
</script>