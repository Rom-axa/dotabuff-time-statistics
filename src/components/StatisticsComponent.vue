<template>
    <div>
        <div>
            FILTERS
        </div>

        <table>
            <tbody>
                <tr>
                    <td>
                        hours
                    </td>
                    <td>
                        
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { inject, onMounted, ref } from "@vue/runtime-core";
import AlertView from "@/views/AlertView.vue";
import ProgressBar from "@/views/ProgressBar.vue";
import {wait} from "@/utils";
// import type DatabaseInterface from 'simple-wrap-indexed-db/dist/Contracts/DatabaseInterface'
import {Storages} from "@/database";
const database = inject(`database`);// as DatabaseInterface;



// (async () => {
//     const result = await database.storage(Storages.UserGames).filter(game => game.date > '2022-01-01').get();

//     const info = result.items.reduce((res, game) => {
//         // console.log(game.datetime);
//         // Abandoned
//         // 2StatisticsComponent.vue:21 Lost Match
//         // StatisticsComponent.vue:21 Won Match

//         if (res.firstGame === null) {
//             res.firstGame = game.datetime;
//         }
//         if (res.lastGame === null) {
//             res.lastGame = game.datetime;
//         }

//         if (res.firstGame > game.datetime) {
//             res.firstGame = game.datetime;
//         }
//         if (res.lastGame < game.datetime) {
//             res.lastGame = game.datetime;
//         }

//         if (game.result === 'Won Match') {
//             res.wins++;
//         } else if (game.result === 'Lost Match') {
//             res.looses++;
//         } else if (game.result === 'Abandoned') {
//             res.abandoned++;
//         }

//         if (game.trueSight) {
//             res.trueSight++;
//         }

//         res.seconds += game.gameDurationSeconds;
//         res.games += 1;

//         return res;
//         // res.wins += 1;
//     }, { seconds: 0, games: 0, wins: 0, looses: 0, abandoned: 0, rating: 0, trueSight: 0, firstGame: null, lastGame: null });


//     console.log(`games`, info.games);
//     console.log(`wins`, info.wins);
//     console.log(`looses`, info.looses);
//     console.log(`abandoned`, info.abandoned);
//     console.log(`trueSight`, info.trueSight);
//     console.log(`firstGame`, info.firstGame);
//     console.log(`lastGame`, info.lastGame);
//     console.log(`seconds`, info.seconds);
//     console.log(`minutes`, (info.seconds / 60).toFixed(2));
//     console.log(`hours`, (info.seconds / 3600).toFixed(2));

// })();

</script>