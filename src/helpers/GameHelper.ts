import type { Game } from "@/types/Game";

export default class GameHelper {
    public static isRating(game: Game): boolean {
        return game.mode === `Ranked`;
    }

    public static isAllPick(game: Game): boolean {
        return game.mode === `All Pick`;
    }
}