import { MinimalComitsData, MinimalHeartDiseaseData, NamedMap } from "../types/types";

const condenseSmallestGroups = (entitiesMap: Map<string, number>, maxGroupsNumber): Map<string, number> => {
    const values = [...entitiesMap.entries()].sort((a, b) => a[1] - b[1]);

    let othersCount = 0;
    while(values.length >= maxGroupsNumber) {
        othersCount += values.shift()[1];
    }

    values.push(['Others', othersCount]);
    return new Map(values);
};

type PiechartConfiguration = {
    maxNumberOfGroups?: number,
    options?: boolean,
    legend?: boolean,
    filter?: boolean,
};

class Piechart<T> {
    extractGroupByField: (it: T) => string;
    configuration: PiechartConfiguration;

    constructor(
        extractGroupByField: (it: T) => string, configuration: PiechartConfiguration = {} ) {
        this.extractGroupByField = extractGroupByField;
        this.configuration = configuration;
    }

    create(inputEntities: T[]) {
        let entitiesMap = new Map<string, number>();

        inputEntities.forEach((entity) => {
            const key = this.extractGroupByField(entity);

            if(entitiesMap.has(key)) {
                entitiesMap.set(key, entitiesMap.get(key) + 1);
            } else {
                entitiesMap.set(key, 1);
            }
        });

        const maximumAllowedGroups = this.configuration?.maxNumberOfGroups;
        if(maximumAllowedGroups && entitiesMap.size > maximumAllowedGroups) {
            entitiesMap = condenseSmallestGroups(entitiesMap, maximumAllowedGroups);
        }

        const result: NamedMap<number> = {};
        entitiesMap.forEach((value, key) => {
            result[key] = value;
        });
    
        return {
            data: {
                values: result,
            },
            options: this.configuration?.options ?? true,
            legend: this.configuration?.legend ?? true,
            filter:this.configuration?.filter ?? true
        };
    }
}

const clientFunction = () => {
    // const piechart = new Piechart<MinimalComitsData>((commit: MinimalComitsData) => commit.committerName);

    // const { fetchMinimalCommitsData } = require('../data/dataProvider');

    // const result = piechart.create(fetchMinimalCommitsData(400));

    const piechart = new Piechart<MinimalHeartDiseaseData>(
        (clinicalCase: MinimalHeartDiseaseData) => {
            if(clinicalCase.age < 35) {
                return 'Aged under 35';
            } else if(clinicalCase.age <= 45) {
                return 'Aged 35 - 45';
            } else if(clinicalCase.age < 55) {
                return 'Aged 46 - 55';
            } else if(clinicalCase.age < 65) {
                return 'Aged 56 - 65';
            }

            return 'Aged above 65';
        },
        {
            maxNumberOfGroups: 3
        }
    );

    const { fetchMinimalHeartDiseaseData } = require('../data/dataProvider');

    const result = piechart.create(fetchMinimalHeartDiseaseData(400, true, 0))

    console.log('client function result: ', result);

    return result;
};

// clientFunction();

module.exports = {
    Piechart,
    clientFunction,
};