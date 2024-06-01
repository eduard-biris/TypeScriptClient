import { MinimalComitsData, MinimalHeartDiseaseData, NamedMap } from "../types/types";

const condenseSmallestGroups = (entitiesMap: Map<string, number>): Map<string, number> => {
    const values = [...entitiesMap.entries()].sort((a, b) => a[1] - b[1]);

    let othersCount = 0;
    while(values.length > 6) {
        othersCount += values.shift()[1];
    }

    values.push(['Others', othersCount]);
    return new Map(values);
};

class Piechart<T> {
    extractGroupByField: (it: T) => string;

    constructor(extractGroupByField: (it: T) => string) {
        this.extractGroupByField = extractGroupByField;
    }

    create(inputEntities: T[]) {
        let entitiesMap = new Map<string, number>();

        inputEntities.forEach((entity) => {
            const fieldName = this.extractGroupByField(entity);

            if(entitiesMap.has(fieldName)) {
                entitiesMap.set(fieldName, entitiesMap.get(fieldName) + 1);
            } else {
                entitiesMap.set(fieldName, 1);
            }
        });

        if(entitiesMap.size > 7) {
            entitiesMap = condenseSmallestGroups(entitiesMap);
        }

        const result: NamedMap<number> = {};
        entitiesMap.forEach((value, key) => {
            result[key] = value;
        });
    
        return result;
    }
}

module.exports = {
    Piechart,
};

const clientFunction = () => {
    // const piechart = new Piechart<MinimalComitsData>((commit: MinimalComitsData) => commit.committerName);

    // const { fetchMinimalCommitsData } = require('../data/dataProvider');

    // const result = piechart.create(fetchMinimalCommitsData(400));

    const piechart = new Piechart<MinimalHeartDiseaseData>((clinicalCase: MinimalHeartDiseaseData) => clinicalCase.sex);

    const { fetchMinimalHeartDiseaseData } = require('../data/dataProvider');

    const result = piechart.create(fetchMinimalHeartDiseaseData(400, true, 0))

    console.log('client function result: ', result);

    return result;
};

clientFunction();

// // The code below is the example
// class PieChart<T> {
//     // let grouper null;

//     // constructor ( grouper: (it: T) => string) {
//     //     grouper = grouper;
//     // }

//     create(objects: T[]) {
//         let objectsMap = new Map<string, number>();

//         objects.forEach((obj) => {
//             if(objectsMap.has(grouper(obj))) {
//                 objectsMap.set(obj.committerName, objectsMap.get(obj.committerName) + 1);
//             } else {
//                 objectsMap.set(obj.committerName, 1);
//             }
//         });
    
//         if(objectsMap.size > 7) {
//             objectsMap = condenseSmallestGroups(objectsMap);
//         }
    
//         const result: NamedMap<number> = {};
//         objectsMap.forEach((value, key) => {
//             result[key] = value;
//         });
    
//         return result;
//     }
// }

// function client() {
//     myPiechart = new PieChart<MinimalComitsData>(it => it.committerName);
// }