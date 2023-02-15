import type { User } from "./User"

export type Game = {
    id: string,
    isInactive: boolean,
    character: string,
    rank: string,
    trueSight: boolean,
    result: string,
    datetime: string,
    date: string,
    type: string,
    mode: string,
    isParty: boolean,
    gameDurationTime: string,
    gameDurationSeconds: number,
    dka: number[],
    user?: User
};