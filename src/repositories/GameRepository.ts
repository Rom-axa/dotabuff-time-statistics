import GameHelper from "@/helpers/GameHelper";
import { makeEmptyCommonStatisticsObject, isTimeObject, type CommonStatistics, isCommonTimeStatistics, isCommonQtyStatistics, type GameModes, type GameTypes } from "@/types/CommonStatistics";
import type { Game } from "@/types/Game";
import AbstractRepository from "./AbstractRepository";

export default class GameRepository extends AbstractRepository<Game>{
    public async *getIds(): AsyncGenerator<string> {
        const limit = 500;
        let offset = 0;
        let result;
    
        do {
            result = await this.storage
                .limit(limit)
                .offset(offset)
                .get();
    
            for (let game of result.items) {
                yield game.id;
            }
            
            offset += limit;
        } while (result.qty === limit);
    }

    public async findUniqueHeroes(): Promise<string[]> {
        const result = await this.storage.get();

        const heroesGames = result.items.reduce((list: {[hero: string]: number}, game: Game) => {
            if (!(game.character in list)) {
                list[game.character] = 1;
            }

            list[game.character]++;
            return list;
        }, {});

        return Object
            .keys(heroesGames)
            .sort((hero1, hero2) => heroesGames[hero1] > heroesGames[hero2] ? -1 : 1);
    }

    public async findCommonStatistics(searchParams: any): Promise<CommonStatistics> {
        const percent = (all: number, x: number) => all > 0 && x > 0 ? parseFloat((((x * 100) / all)).toFixed(2)) : 0;

        const result = await this.storage
            .filter((game: Game) => (
                game.date >= `2022-01-01`
            ))
            .get();
        
        const games = result.items.concat([]).sort((game1, game2) => game1.date >= game2.date ? 1 : -1);

        // console.log(games.map(game => `${game.user?.name} ${game.date} ${game.result}`));

        const statistics = games.reduce((statistics: CommonStatistics, game: Game): CommonStatistics => {
            const isWon = GameHelper.isWon(game);
            const isLost = GameHelper.isLost(game);
            const isAbandoned = GameHelper.isAbandoned(game);

            statistics.timeInGames.all.all.seconds += game.gameDurationSeconds;
            statistics.allGames.all.all++;

            if (isWon) {
                statistics.wonGames.all.all.value++;
            } else if (isLost) {
                statistics.lostGames.all.all.value++;
            } else if (isAbandoned) {
                statistics.abandonedGames.all.all.value++;
            }

            if (game.trueSight) {
                statistics.trueSightedGames.all.all.value++;
            }

            Object.keys(statistics).forEach(key => {
                if (
                    key === `approximateTimeInDota` ||
                    (key === `wonGames` && !isWon) ||
                    (key === `lostGames` && !isLost) ||
                    (key === `abandonedGames` && !isAbandoned) ||
                    (key === `trueSightedGames` && !game.trueSight)
                ) {
                    return;
                }
                
                const commonStatistics: any = statistics[key as keyof CommonStatistics];

                Object.keys(commonStatistics).forEach(mode => {
                    if (
                        (GameHelper.isRating(game) && mode !== `rating`) ||
                        (GameHelper.isAllPick(game) && mode !== `allPick`) ||
                        ((GameHelper.isAllPick(game) || GameHelper.isRating(game)) && mode === `other`)
                    ) {
                        return;
                    }
                    
                    Object.keys(commonStatistics[mode] as Object).forEach(type => {
                        if (
                            (mode === `all`) ||
                            (type === `solo` && game.isParty) ||
                            (type === `party` && !game.isParty)
                        ) {
                            return;
                        }

                        if (isCommonTimeStatistics(commonStatistics)) {
                            // @ts-ignore
                            commonStatistics[mode][type].value.seconds += game.gameDurationSeconds;
                        } else if (isCommonQtyStatistics(commonStatistics)) {
                            // @ts-ignore
                            commonStatistics[mode][type].value++;
                        }
                    })
                });
            });

            return statistics;
        }, makeEmptyCommonStatisticsObject());

        // const statistics2 = result.items.reduce((statistics: CommonStatistics, game: Game): CommonStatistics => {
        //     statistics.timeInGames.all.all.seconds += game.gameDurationSeconds;
        //     statistics.allGames.all.all++;

        //     const isWon = GameHelper.isWon(game);
        //     const isLost = GameHelper.isLost(game);
        //     const isAbandoned = GameHelper.isAbandoned(game);

        //     if (isWon) {
        //         statistics.wonGames.all.all++;
        //     } else if (isLost) {
        //         statistics.lostGames.all.all++;
        //     } else if (isAbandoned) {
        //         statistics.abandonedGames.all.all++;
        //     }

        //     if (game.trueSight) {
        //         statistics.trueSightedGames.all.all++;
        //     }

        //     if (GameHelper.isRating(game)) {
        //         statistics.timeInGames.rating.all.value.seconds += game.gameDurationSeconds;
        //         statistics.allGames.rating.all.value++;

        //         if (isWon) {
        //             statistics.wonGames.rating.all.value++;
        //         } else if (isLost) {
        //             statistics.lostGames.rating.all.value++;
        //         } else if (isAbandoned) {
        //             statistics.abandonedGames.rating.all.value++;
        //         }
    
        //         if (game.trueSight) {
        //             statistics.trueSightedGames.rating.all.value++;
        //         }                

        //         if (game.isParty) {
        //             statistics.timeInGames.rating.party.value.seconds += game.gameDurationSeconds;
        //             statistics.allGames.rating.party.value++;
        //             statistics.wonGames.rating.party.value++;
        //             statistics.lostGames.rating.party.value++;
        //             statistics.abandonedGames.rating.party.value++;
        //             statistics.trueSightedGames.rating.party.value++;

        //         } else {
        //             statistics.timeInGames.rating.solo.value.seconds += game.gameDurationSeconds;
        //             statistics.allGames.rating.solo.value++;
        //             statistics.wonGames.rating.solo.value++;
        //             statistics.lostGames.rating.solo.value++;
        //             statistics.abandonedGames.rating.solo.value++;
        //             statistics.trueSightedGames.rating.solo.value++;

        //         }
        //     } else if (GameHelper.isAllPick(game)) {
        //         statistics.timeInGames.allPick.all.value.seconds += game.gameDurationSeconds;
        //         statistics.allGames.allPick.all.value++;
        //         statistics.wonGames.allPick.all.value++;
        //         statistics.lostGames.allPick.all.value++;
        //         statistics.abandonedGames.allPick.all.value++;
        //         statistics.trueSightedGames.allPick.all.value++;
                
        //         if (game.isParty) {
        //             statistics.timeInGames.allPick.party.value.seconds += game.gameDurationSeconds;
        //             statistics.allGames.allPick.party.value++;
        //             statistics.wonGames.allPick.party.value++;
        //             statistics.lostGames.allPick.party.value++;
        //             statistics.abandonedGames.allPick.party.value++;
        //             statistics.trueSightedGames.allPick.all.value++;

        //         } else {
        //             statistics.timeInGames.allPick.solo.value.seconds += game.gameDurationSeconds;
        //             statistics.allGames.allPick.solo.value++;
        //             statistics.wonGames.allPick.solo.value++;
        //             statistics.lostGames.allPick.solo.value++;
        //             statistics.abandonedGames.allPick.solo.value++;
        //             statistics.trueSightedGames.allPick.solo.value++;

        //         }
        //     } else {
        //         statistics.timeInGames.other.all.value.seconds += game.gameDurationSeconds;
        //         statistics.allGames.other.all.value++;
        //         statistics.wonGames.other.all.value++;
        //         statistics.lostGames.other.all.value++;
        //         statistics.abandonedGames.other.all.value++;
        //         statistics.trueSightedGames.other.all.value++;

        //         if (game.isParty) {
        //             statistics.timeInGames.other.party.value.seconds += game.gameDurationSeconds;
        //             statistics.allGames.other.party.value++;
        //             statistics.wonGames.other.party.value++;
        //             statistics.lostGames.other.party.value++;
        //             statistics.abandonedGames.other.party.value++;
        //             statistics.trueSightedGames.other.party.value++;

        //         } else {
        //             statistics.timeInGames.other.solo.value.seconds += game.gameDurationSeconds;
        //             statistics.allGames.other.solo.value++;
        //             statistics.wonGames.other.solo.value++;
        //             statistics.lostGames.other.solo.value++;
        //             statistics.abandonedGames.other.solo.value++;
        //             statistics.trueSightedGames.other.solo.value++;

        //         }
        //     }

        //     return statistics;
        // }, makeEmptyCommonStatisticsObject());

        // console.log(`built statistics`, statistics);

        // calculate percents
        for (let key of [`timeInGames`, `wonGames`, `lostGames`, `abandonedGames`, `trueSightedGames`]) {
            for (let mode of [`rating`, `allPick`, `other`, `all`]) {
                for (let type of [`solo`, `party`, `all`]) {
                    if (mode === `all` && type === `all`) {
                        continue;
                    }

                    // @ts-ignore
                    if (isTimeObject(statistics[key][mode][type].value)) {
                         // @ts-ignore
                        const commonStatistics: CommonTimeStatistics = statistics[key];

                        commonStatistics[mode][type].percent = percent(
                            commonStatistics[mode].all.seconds,
                            commonStatistics[mode][type].value.seconds
                        );
                    } else {
                        // @ts-ignore
                        const keyStatistics: CommonQtyStatistics = statistics[key];

                        keyStatistics[mode][type].percent = percent(
                            keyStatistics[mode].all.value,
                            keyStatistics[mode][type].value
                        );
                    }
                }
            }
        }

        statistics.approximateTimeInDota = statistics.timeInGames.all.all.seconds + (statistics.allGames.all.all * (4 * 60 * 1.5));
        
        return statistics;
    }
    
    public async findGeneralStatistics(searchParams: any): Promise<void>
    {
        // const result = await this.storage
        //     .filter((game: Game) => (
        //         game.date >= `2022-01-01`
        //     ))
        //     .get();

        // result.items.reduce((statistics: any, game: Game) => {
        //     const isWon = GameHelper.isWon(game);
        //     const isLost = GameHelper.isLost(game);
        //     const isAbandoned = GameHelper.isAbandoned(game);

        //     statistics.timeInGames += game.gameDurationSeconds;
        //     statistics.allGames++;
            
        //     if (isWon) {
        //         statistics.wonGames++;
        //     } else if (isLost) {
        //         statistics.lostGames++;
        //     } else if(isAbandoned) {
        //         statistics.abandonedGames++;
        //     }

        //     // if (GameHelper.isRating()) {

        //     // }


        //     return statistics;
        // }, {});
    }
}