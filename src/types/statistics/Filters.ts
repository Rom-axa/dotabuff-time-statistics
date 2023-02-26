import type { DateTime } from "luxon";
import type { User } from "../User";

export enum GamesPlayersQty {
    solo = 1,
    party = 2,
    all = 0,
};

export enum GameModes {
    allPick = `All Pick`,
    turbo = `Turbo`,
    singleDraft = `Single Draft`,
    other = `Other`,
}

export type Filters = {
    fromDate: DateTime | null,
    toDate: DateTime | null,
    isRating: boolean,
    selectedUsers: User[],
    gamesModes: GameModes[],
    gamePlayersQty: number,
    selectedHeroes: string[],
}