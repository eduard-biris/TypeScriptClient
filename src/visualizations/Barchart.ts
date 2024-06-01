import { MinimalComitsData, NamedMap } from "../types/types";

class Barchart<T> {
    extractXAxisField: (it: T) => string;
    extractYAxisField: (it: T) => string;

    constructor(
        extractXAxisField: (it: T) => string,
        extractYAxisField: (it: T) => string
    ) {
        this.extractXAxisField = extractXAxisField;
        this.extractYAxisField = extractYAxisField;
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
            const xAxis = this.extractXAxisField(entity);
            const yAxis = this.extractYAxisField(entity);

            if(!result[xAxis]) {
                result[xAxis] = {};
            }
    
            if(!result[xAxis][yAxis]) {
                result[xAxis][yAxis] = 0;
            }
    
            result[xAxis][yAxis] += 1;
        });
    
        const resultWithReducedXAxisEntries: typeof result = {};
        Object.keys(result).forEach((key, index) => {
            if(index > 6) return;
    
            resultWithReducedXAxisEntries[key] = result[key];
        });
    
        return this.mapDataToChartInputType(resultWithReducedXAxisEntries);
    }
}

module.exports = {
    Barchart,
};

const barchartClient = () => {
    const { fetchMinimalCommitsData } = require('../data/dataProvider');

    const commits: MinimalComitsData[] = fetchMinimalCommitsData();

    const barchart = new Barchart<MinimalComitsData>(
        (commit: MinimalComitsData) => commit.date,
        (commit: MinimalComitsData) => commit.committerName,
    );

    const result = barchart.create(commits);

    const util = require('util');
    console.log('Barchart client: ', util.inspect({
        data: result,
        legend: true,
        options: true,
        type: 'bar',
    }, false, 30));

    return result;
};

barchartClient();
