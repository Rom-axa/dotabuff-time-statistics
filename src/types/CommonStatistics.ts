import type { DateTime } from "luxon";

export type GameTypes<T, D = T> = {
    solo: T,
    party: T,
    all: D,
};

export type GameModes<T, D = T> = {
    rating: T,
    allPick: T,
    other: T,
    all: D,
};

export type QtyWithPercent<T = number> = {
    value: T,
    percent: number,
};

export type Time = {
    seconds: number,
    minutes: number,
    hours: number,  
};

export type CommonTimeStatistics = GameModes<GameTypes<QtyWithPercent<Time>>, GameTypes<QtyWithPercent<Time>, Time>>;
export type CommonQtyStatistics = GameModes<GameTypes<QtyWithPercent>, GameTypes<QtyWithPercent, number>>;
export type CommonQtyStatisticsWithPercents = GameModes<GameTypes<QtyWithPercent>>;

export type CommonStatistics = {
    approximateTimeInDota: number,
    timeInGames: CommonTimeStatistics,
    allGames: CommonQtyStatistics,
    wonGames: CommonQtyStatisticsWithPercents,
    lostGames: CommonQtyStatisticsWithPercents,
    abandonedGames: CommonQtyStatisticsWithPercents,
    trueSightedGames: CommonQtyStatisticsWithPercents,
}

const makeEmptyGameTypesObject = <T, D>(getValue: () => T, getValueForAll: null | (() => D | null) = null): GameTypes<T, D> => ({
    solo: getValue(),
    party: getValue(),
    all: (getValueForAll ?? getValue)() as D,
});

const makeEmptyGameModesObject = <T, D>(getValue: () => T, getValueForAll: null | (() => D | null) = null): GameModes<T, D> => ({
    rating: getValue(),
    allPick: getValue(),
    other: getValue(),
    all: (getValueForAll ?? getValue)() as D,
});

const makeEmptyQtyWithPercentObject = <T>(getValue: () => T): QtyWithPercent<T> => ({
    value: getValue(),
    percent: 0,
});

const makeEmptyTimeObject = (): Time => ({
    seconds: 0,
    get minutes(): number {
        return Math.floor(this.seconds / 60);
    },
    get hours(): number {
        return Math.floor(this.minutes / 60);
    },
    set minutes(value){},
    set hours(value){},
});

export const isTimeObject = (object: any): object is Time => (
    object instanceof Object &&
    `seconds` in object &&
    typeof object.seconds === `number`
);

export const isCommonTimeStatistics = (object: any): object is CommonTimeStatistics => (
    object instanceof Object &&
    object?.all?.all !== undefined &&
    isTimeObject(object.all.all)
);

export const isCommonQtyStatistics = (object: any): object is CommonQtyStatistics => (
    object instanceof Object &&
    object?.all?.all !== undefined &&
    typeof object.all.all === `number`
);

export const makeEmptyCommonStatisticsObject = (): CommonStatistics => JSON.parse(JSON.stringify({
    approximateTimeInDota: 0,
    timeInGames: makeEmptyGameModesObject(
        () => makeEmptyGameTypesObject(
            () => makeEmptyQtyWithPercentObject(
                () => makeEmptyTimeObject()
            )
        ),
        () => makeEmptyGameTypesObject(
            () => makeEmptyQtyWithPercentObject(
                () => makeEmptyTimeObject()
            ),
            () => makeEmptyTimeObject(),
        )
    ),
    allGames: makeEmptyGameModesObject(
        () => makeEmptyGameTypesObject(
            () => makeEmptyQtyWithPercentObject(() => 0)
        ),
        () => makeEmptyGameTypesObject(
            () => makeEmptyQtyWithPercentObject(() => 0),
            () => 0
        ),
    ),
    wonGames: makeEmptyGameModesObject(
        () => makeEmptyGameTypesObject(
            () => makeEmptyQtyWithPercentObject(() => 0)
        )
    ),
    lostGames: makeEmptyGameModesObject(
        () => makeEmptyGameTypesObject(
            () => makeEmptyQtyWithPercentObject(() => 0)
        )
    ),
    abandonedGames: makeEmptyGameModesObject(
        () => makeEmptyGameTypesObject(
            () => makeEmptyQtyWithPercentObject(() => 0)
        )
    ),
    trueSightedGames: makeEmptyGameModesObject(
        () => makeEmptyGameTypesObject(
            () => makeEmptyQtyWithPercentObject(() => 0)
        )
    ),
}));

export type Filters = {
    fromDate: DateTime | null,
    toDate: DateTime | null,
}

export const makeEmptyFilters = (): Filters => ({
    fromDate: null,
    toDate: null,
})


/* REAL TYPE =) */
export type CommonStatistics2 = {
    approximateTimeInDota: number,
    timeInGames: {
        rating: {
            solo: {
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
            },
            party: {
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
            },
            all: {
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
            },
        },
        allPick: {
            solo: {
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
            },
            party: {
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
            },
            all: {
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
            },
        },
        other: {
            solo: {
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
            },
            party: {
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
            },
            all: {
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
            },
        },
        all: {
            solo: {
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
            },
            party: {
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
            },
            all: {
                seconds: number,
                minutes: number,
                hours: number,  
            },
        },
    },
    allGames: {
        rating: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        allPick: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        other: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        all: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: number,
        },
    },
    wonGames: {
        rating: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        allPick: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        other: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        all: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: number,
        },
    },
    lostGames: {
        rating: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        allPick: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        other: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        all: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: number,
        },
    },
    abandonedGames: {
        rating: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        allPick: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        other: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        all: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: number,
        },
    },
    trueSightedGames: {
        rating: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        allPick: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        other: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: {
                value: number,
                percent: number,
            },
        },
        all: {
            solo: {
                value: number,
                percent: number,
            },
            party: {
                value: number,
                percent: number,
            },
            all: number,
        },
    },
}
/* */