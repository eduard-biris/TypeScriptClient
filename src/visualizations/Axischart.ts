import { MinimalComitsData, MinimalHeartDiseaseData, NamedMap } from "../types/types";

type AxischartConfiguration = {
    legend?: boolean,
    options?: boolean,
    type?: 'line' | 'bar',
    maxNumberOfEntries?: number,
};

class Axischart<T> {
    labelGenerator: (it: T) => string;
    axisGenerator: (it: T) => string;
    configuration: AxischartConfiguration;

    constructor(
        labelGenerator: (it: T) => string,
        axisGenerator: (it: T) => string,
        configuration: AxischartConfiguration = { legend: true, options: true }
    ) {
        this.labelGenerator = labelGenerator;
        this.axisGenerator = axisGenerator;
        this.configuration = configuration;
    }

    mapDataToChartInputType(data: NamedMap<NamedMap<number>>) {
        let result: NamedMap<number[]> = {};
        let yAxisEntries = new Set<string>();
    
        for(let xAxisEntry in data) {
            for(let yAxisEntry in data[xAxisEntry]) {
                yAxisEntries.add(yAxisEntry);
    
                if(!result[yAxisEntry]) {
                    result[yAxisEntry] = [];
                }
            }
        }
    
        for(let xAxisEntry in data) {
            for(let yAxisEntry of yAxisEntries) {
                if(data[xAxisEntry][yAxisEntry]) {
                    result[yAxisEntry].push(data[xAxisEntry][yAxisEntry]);
                } else {
                    result[yAxisEntry].push(0);
                }
            }
        }
    
        return {
            headers: Object.keys(data),
            values: result,
        };
    }

    create(entities: T[]) {
        const result: NamedMap<NamedMap<number>> = {};

        entities.forEach((entity) => {
            const xAxis = this.labelGenerator(entity);
            const yAxis = this.axisGenerator(entity);

            if(!result[xAxis]) {
                result[xAxis] = {};
            }
    
            if(!result[xAxis][yAxis]) {
                result[xAxis][yAxis] = 0;
            }
    
            result[xAxis][yAxis] += 1;
        });
    
        const maxAllowedNumberOfEntries = this.configuration?.maxNumberOfEntries;
        if(maxAllowedNumberOfEntries) {
            const resultWithReducedXAxisEntries: typeof result = {};
            Object.keys(result).forEach((key, index) => {
                if(index > 6) return;
        
                resultWithReducedXAxisEntries[key] = result[key];
            });
        
            return this.mapDataToChartInputType(resultWithReducedXAxisEntries);
        }

        return this.mapDataToChartInputType(result);
    }
}

module.exports = {
    Axischart,
};

const medicalAxischartClient = () => {
    const { fetchMinimalHeartDiseaseData } = require('../data/dataProvider');

    const clinicalCases = fetchMinimalHeartDiseaseData();

    const mapActualAgeToAgeGroup = (clinicalCase: MinimalHeartDiseaseData): string => {
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
    }

    const mapCholesterolLevelToGroup = (clinicalCase: MinimalHeartDiseaseData): string => {
        if(clinicalCase.cholesterol < 200) {
            return 'Normal';
        } else if(clinicalCase.cholesterol < 240) {
            return 'Moderately Elevated';
        } else {
            return 'High';
        }
    }

    const CholesterolLevelsByAgeGroupBarchart = new Axischart<MinimalHeartDiseaseData>(
        mapActualAgeToAgeGroup,
        mapCholesterolLevelToGroup,
        {
            maxNumberOfEntries: 6,
        }
    );

    const result = CholesterolLevelsByAgeGroupBarchart.create(clinicalCases);

    console.log('result: ', result);

    return result;
}

medicalAxischartClient();

// const barchartClient = () => {
//     const { fetchMinimalCommitsData } = require('../data/dataProvider');

//     const commits: MinimalComitsData[] = fetchMinimalCommitsData();

//     const barchart = new Axischart<MinimalComitsData>(
//         (commit: MinimalComitsData) => commit.date,
//         (commit: MinimalComitsData) => commit.committerName,
//         {
//             maxNumberOfEntries: 6,
//         }
//     );

//     const result = barchart.create(commits);

//     const util = require('util');
//     console.log('Barchart client: ', util.inspect({
//         data: result,
//         legend: true,
//         options: true,
//         type: 'bar',
//     }, false, 30));

//     return result;
// };

// barchartClient();
