import { MinimalComitsData } from "../types/types";

interface TimelineConstructorParams<T> {
    extractDateField: (it: T) => string,
    extractSummary: (it: T) => string,
    extractTime: (it: T) => string,
    extractAuthorField: (it: T) => string,
    extractTypeField: (it: T) => string,
    extractTimelineSummary: (itGroup: any, groupName: string) => string
}

class Timeline<T> {
    extractDateField: (it: T) => string;
    extractSumary: (it: T) => string;
    extractTime: (it: T) => string;
    extractAuthorField: (it: T) => string;
    extractTypeField: (it: T) => string;
    extractTimelineSummary: (itGroup: any, groupName: string) => string

    constructor(params: TimelineConstructorParams<T>) {
        this.extractDateField = params.extractDateField;
        this.extractSumary = params.extractSummary;
        this.extractTime = params.extractTime;
        this.extractAuthorField = params.extractAuthorField;
        this.extractTypeField = params.extractTypeField;
        this.extractTimelineSummary = params.extractTimelineSummary;
    }

    create(entities: T[]) {
        const groupedEntities = {};

        entities.forEach((entity) => {
            const desiredInfo = {
                summary: this.extractSumary(entity),
                date: this.extractTime(entity),
                author: this.extractAuthorField(entity),
                type: this.extractTypeField(entity),
            };
    
            const dateField = this.extractDateField(entity);
            if(!groupedEntities[dateField]) {
                groupedEntities[dateField] = [desiredInfo];
            } else {
                groupedEntities[dateField].push(desiredInfo);
            }
        });
    
        const timelineData = {};
        Object.keys(groupedEntities).forEach((groupName) => {
            timelineData[groupName] = {
                summary: {
                    title: this.extractTimelineSummary(groupedEntities, groupName),
                },
                events: groupedEntities[groupName],
            };
        });
    
        return {
            data: timelineData,
        };
    }
}

module.exports = {
    Timeline,
}

const clientFunction = () => {
    const { fetchMinimalCommitsData } = require('../data/dataProvider');

    const commits = fetchMinimalCommitsData(100);

    const timeline = new Timeline<MinimalComitsData>({
        extractDateField: (it: MinimalComitsData) => it.date,
        extractSummary: (it: MinimalComitsData) => `${it.committerName}: ${it.message}`,
        extractTime: (it: MinimalComitsData) => it.time,
        extractAuthorField: (it: MinimalComitsData) => it.committerEmail,
        extractTypeField: (it: MinimalComitsData) => it.committerName,
        extractTimelineSummary: (itGroup, groupName) => `${itGroup[groupName].length} commits on ${groupName}`,
    });

    const result = timeline.create(commits);

    const util = require('util');
    console.log('Result from timeline: ', util.inspect(result, false, 30));
    return result;
};

clientFunction();
