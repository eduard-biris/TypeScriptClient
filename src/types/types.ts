type MinimalComitsData = {
    committerName: string,
    committerEmail: string,
    date: string,
    time: string,
    message: string,
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
    NamedMap,
    Visualization,
};
