import GameHelper from "@/helpers/GameHelper";
import type { Game } from "@/types/Game";
import { GamesPlayersQty, type Filters } from "@/types/statistics/Filters";
import { GameModes } from "@/types/statistics/Filters";
import { makeEmptyReport, type Report } from "@/types/statistics/Report";
import { empty } from "@/utils";
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


    public async findStatistics(filters: Filters): Promise<Report> {
        const fromDate = filters.fromDate?.toSQL() ?? null;
        const toDate = filters.toDate?.toSQL() ?? null;
        const usersIds = filters.selectedUsers.map(user => user.id);
        const filterByGameMode = !empty(filters.gamesModes);
        const filterByStartDate = fromDate !== null;
        const filterByEndDate = toDate !== null;
        const filterByHero = !empty(filters.selectedHeroes);
        const filterByUser = !empty(usersIds);
        
        const isGameModeAppropriate = (game: Game): boolean => (
            (filters.gamesModes.includes(GameModes.allPick) && GameHelper.isAllPick(game)) ||
            (filters.gamesModes.includes(GameModes.singleDraft) && GameHelper.isSingleDraft(game)) ||
            (filters.gamesModes.includes(GameModes.turbo) && GameHelper.isTurbo(game)) ||
            (filters.gamesModes.includes(GameModes.other) && !GameHelper.isAllPick(game) && !GameHelper.isTurbo(game) && !GameHelper.isSingleDraft(game))
        );
        const isGamePlayersQtyAppropriate = (game: Game): boolean => (
            GamesPlayersQty.all === filters.gamePlayersQty ||
            (GamesPlayersQty.solo === filters.gamePlayersQty && !game.isParty) ||
            (GamesPlayersQty.party === filters.gamePlayersQty && game.isParty)
        );
        const isUserAppropriate = (game: Game): boolean => (
            game.user?.id !== undefined &&
            usersIds.includes(game.user.id)
        );
        
        const result = await this.storage
            .filter((game: Game) => !(
                (filterByStartDate && game.date < fromDate) ||
                (filterByEndDate && game.date > toDate) ||
                (filters.isRating && !GameHelper.isRating(game)) ||
                (filterByGameMode && !isGameModeAppropriate(game)) ||
                !isGamePlayersQtyAppropriate(game) ||
                (filterByUser && !isUserAppropriate(game)) ||
                (filterByHero && !filters.selectedHeroes.includes(game.character))
            ))
            .get();

        console.debug(`games`, result.items);

        const report = result.items.reduce((report, game) => {
            if (GameHelper.isWon(game) && !game.isInactive) {
                report.wonGames.value++;
            } else if (GameHelper.isLost(game) && !game.isInactive) {
                report.lostGames.value++;
            } else if (GameHelper.isAbandoned(game) || game.isInactive) {
                report.abandonedGames.value++;
            }

            if (game.trueSight) {
                report.trueSightedGames.value++;
            }

            report.allGames++;
            report.timeInGames += game.gameDurationSeconds;

            return report;
        }, makeEmptyReport());

        report.approximateTimeInDota = (report.allGames * (105 + 60 + 30)) + report.timeInGames;

        return report;
    }
}