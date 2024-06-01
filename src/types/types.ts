type MinimalComitsData = {
    committerName: string,
    committerEmail: string,
    date: string,
    time: string,
    message: string,
};

type MinimalHeartAttackData = {
    age: number,
    sex: string,
    chestPainType: string,
    cholesterol: number,
    fastingBloodSugar: number,
};

type NamedMap<T> = {
    [key: string]: T;
};

type Visualization = {
    type: string,
    data: any,
};

export type {
    MinimalComitsData,
    MinimalHeartAttackData,
    NamedMap,
    Visualization,
};
