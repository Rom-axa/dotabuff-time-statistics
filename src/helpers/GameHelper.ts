import type { Game } from "@/types/Game";

export default class GameHelper {
    public static isRating(game: Game): boolean {
        return game.type === `Ranked`;
    }

    public static isAllPick(game: Game): boolean {
        return game.mode === `All Pick`;
    }

    public static isSingleDraft(game: Game): boolean {
        return game.mode === `Single Draft`;
    }

    public static isTurbo(game: Game): boolean {
        return game.mode === `Turbo`;
    }

    public static isWon(game: Game): boolean {
        return game.result === `Won Match`;
    }

    public static isLost(game: Game): boolean {
        return game.result === `Lost Match`;
    }

    public static isAbandoned(game: Game): boolean {
        return game.result === `Abandoned`;
    }
}