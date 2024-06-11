import { MinimalCommitsData, MinimalHeartDiseaseData, NamedMap } from "../types/types";

type AxischartConfiguration = {
    legend?: boolean,
    options?: boolean,
    type?: 'line' | 'bar',
    maxNumberOfEntries?: number,
    labelSorter?: (l1: string, l2: string) => number,
};

const mapDataToChartInputType = (data: NamedMap<NamedMap<number>>, labelSorter: (l1: string, l2: string) => number = () => 0) => {
    let result: NamedMap<number[]> = {};
    let yAxisEntries = new Set<string>();

    const sortedLabels = Object.keys(data).sort(labelSorter);
    console.log('Sorted labels: ', sortedLabels);

    for(const xAxisEntry of sortedLabels) {
        for(let yAxisEntry in data[xAxisEntry]) {
            yAxisEntries.add(yAxisEntry);

            if(!result[yAxisEntry]) {
                result[yAxisEntry] = [];
            }
        }
    }

    for(const xAxisEntry of sortedLabels) {
        for(let yAxisEntry of yAxisEntries) {
            if(data[xAxisEntry][yAxisEntry]) {
                result[yAxisEntry].push(data[xAxisEntry][yAxisEntry]);
            } else {
                result[yAxisEntry].push(0);
            }
        }
    }

    return {
        headers: sortedLabels,
        values: result,
    };
}

class Axischart<T> {
    labelGenerator: (it: T) => string;
    axisGenerator: (it: T) => string;
    configuration: AxischartConfiguration;

    constructor(
        labelGenerator: (it: T) => string,
        axisGenerator: (it: T) => string,
        configuration: AxischartConfiguration = { }
    ) {
        this.labelGenerator = labelGenerator;
        this.axisGenerator = axisGenerator;
        this.configuration = configuration;
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

        console.log('Result 1: ', result);
    
        const maxAllowedNumberOfEntries = this.configuration?.maxNumberOfEntries;
        if(maxAllowedNumberOfEntries) {
            const resultWithReducedXAxisEntries: typeof result = {};
            Object.keys(result).forEach((key, index) => {
                if(index >= maxAllowedNumberOfEntries) return;
        
                resultWithReducedXAxisEntries[key] = result[key];
            });

            return {
                data: mapDataToChartInputType(resultWithReducedXAxisEntries, this.configuration?.labelSorter),
                legend: this.configuration?.legend ?? true,
                options: this.configuration?.options ?? true,
                type: this.configuration?.type ?? 'bar'
            }
        }

        return {
            data: mapDataToChartInputType(result, this.configuration?.labelSorter),
            legend: this.configuration?.legend ?? true,
            options: this.configuration?.options ?? true,
            type: this.configuration?.type ?? 'bar'
        }
    }
}

const medicalAxischartClient = () => {
    const { fetchMinimalHeartDiseaseData } = require('../data/dataProvider');

    const clinicalCases = fetchMinimalHeartDiseaseData();

    const mapActualAgeToAgeGroup = (clinicalCase: MinimalHeartDiseaseData): string => {
        if(clinicalCase.age < 35) {
            return 'Aged under 35';
        } else if(clinicalCase.age <= 45) {
            return 'Aged 35 - 45';
        } else if(clinicalCase.age <= 55) {
            return 'Aged 46 - 55';
        } else if(clinicalCase.age <= 65) {
            return 'Aged 56 - 65';
        }

        return 'Aged at least 66';
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
            labelSorter: (l1: string , l2: string) => parseInt(l1.slice(-2)) - parseInt(l2.slice(-2)),
            type: 'line',
        }
    );

    const result = CholesterolLevelsByAgeGroupBarchart.create(clinicalCases);

    const util = require('util');
    console.log('result: ', util.inspect(result, false, 30));

    return result;
}

medicalAxischartClient();

module.exports = {
    Axischart,
    medicalAxischartClient,
};

const barchartClient = () => {
    const { fetchMinimalCommitsData } = require('../data/dataProvider');

    const commits: MinimalCommitsData[] = fetchMinimalCommitsData();

    const barchart = new Axischart<MinimalCommitsData>(
        (commit: MinimalCommitsData) => commit.date,
        (commit: MinimalCommitsData) => commit.committerName,
        {
            maxNumberOfEntries: 6,
        }
    );

    const result = barchart.create(commits);

    const util = require('util');
    console.log('result: ', util.inspect(result, false, 30));

    return result;
};

// barchartClient();
