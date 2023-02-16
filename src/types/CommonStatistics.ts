export type GameTypes<T> = {
    solo: T,
    party: T,
    all: T,
};

export type GameModes<T> = {
    rating: T,
    allPick: T,
    other: T,
    all: T,
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

export type CommonStatistics = {
    approximateTimeInDota: number,
    timeInGames: GameModes<GameTypes<QtyWithPercent<Time>>>,
    allGames: GameModes<GameTypes<QtyWithPercent>>,
    wonGames: GameModes<GameTypes<QtyWithPercent>>,
    lostGames: GameModes<GameTypes<QtyWithPercent>>,
    abandonedGames: GameModes<GameTypes<QtyWithPercent>>,
    trueSightedGames: GameModes<GameTypes<QtyWithPercent>>,
}

const makeEmptyGameTypesObject = <T>(value: T): GameTypes<T> => ({
    solo: value,
    party: value,
    all: value,
});

const makeEmptyGameModesObject = <T>(value: T): GameModes<T> => ({
    rating: value,
    allPick: value,
    other: value,
    all: value,
});

const makeEmptyQtyWithPercentObject = <T>(value: T): QtyWithPercent<T> => ({
    value,
    percent: 0,
});

const makeEmptyTimeObject = (): Time => ({
    seconds: 0,
    get minutes(): number {
        return this.seconds * 60;
    },
    get hours(): number {
        return this.minutes * 60;
    },
    set minutes(value){},
    set hours(value){},
});

export const makeEmptyCommonStatisticsObject = (): CommonStatistics => ({
    approximateTimeInDota: 0,
    timeInGames: makeEmptyGameModesObject(
        makeEmptyGameTypesObject(
            makeEmptyQtyWithPercentObject(
                makeEmptyTimeObject()
            )
        )
    ),
    allGames: makeEmptyGameModesObject(
        makeEmptyGameTypesObject(
            makeEmptyQtyWithPercentObject(0)
        )
    ),
    wonGames: makeEmptyGameModesObject(
        makeEmptyGameTypesObject(
            makeEmptyQtyWithPercentObject(0)
        )
    ),
    lostGames: makeEmptyGameModesObject(
        makeEmptyGameTypesObject(
            makeEmptyQtyWithPercentObject(0)
        )
    ),
    abandonedGames: makeEmptyGameModesObject(
        makeEmptyGameTypesObject(
            makeEmptyQtyWithPercentObject(0)
        )
    ),
    trueSightedGames: makeEmptyGameModesObject(
        makeEmptyGameTypesObject(
            makeEmptyQtyWithPercentObject(0)
        )
    ),
});

/* REAL TYPE =)
export type CommonStatistics = 
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
                value: {
                    seconds: number,
                    minutes: number,
                    hours: number,  
                },
                percent: number,
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
            all: {
                value: number,
                percent: number,
            },
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
            all: {
                value: number,
                percent: number,
            },
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
            all: {
                value: number,
                percent: number,
            },
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
            all: {
                value: number,
                percent: number,
            },
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
            all: {
                value: number,
                percent: number,
            },
        },
    },
}
*/