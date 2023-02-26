export type QtyWithPercent<T = number> = {
    value: T,
    percent: number,
};

export type Report = {
    approximateTimeInDota: number,
    timeInGames: number,
    allGames: number,
    wonGames: QtyWithPercent<number>,
    lostGames: QtyWithPercent<number>,
    abandonedGames: QtyWithPercent<number>,
    trueSightedGames: QtyWithPercent<number>,
};

const makeEmptyQtyWithPercentObject = (getAll: () => number): QtyWithPercent & {all: () => number} => ({
    value: 0,
    all: getAll,
    get percent(): number {
        const all = this.all();
        return all > 0 && this.value > 0 ? (this.value * 100 / all) : 0;
    },
    set percent(value: any) {}
});

export const makeEmptyReport = (): Report => {
    const report: any = {
        approximateTimeInDota: 0,
        timeInGames: 0,
        allGames: 0,
    };

    report.wonGames = makeEmptyQtyWithPercentObject(() => report.allGames);
    report.lostGames = makeEmptyQtyWithPercentObject(() => report.allGames);
    report.abandonedGames = makeEmptyQtyWithPercentObject(() => report.allGames);
    report.trueSightedGames = makeEmptyQtyWithPercentObject(() => report.allGames);

    return report;
};