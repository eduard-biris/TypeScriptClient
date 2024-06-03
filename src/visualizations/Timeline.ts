import { MinimalComitsData } from "../types/types";

type TimelineEventTag = {
    name: string;
}

type TimelineEvent = {
    summary: string;
    date: string;
    type: string;
    author: string;
    tags?: TimelineEventTag[];
    description?: string;
}

type TimelineConstructorParams<T> = {
    extractDate: (it: T) => string,
    extractEvent: (it: T) => TimelineEvent,
    extractTimelineSummary: (itGroup: any, groupName: string) => string
}

class Timeline<T> {
    extractDate: (it: T) => string;
    extractEvent: (it: T) => TimelineEvent;
    extractTimelineSummary: (itGroup: any, groupName: string) => string

    constructor(params: TimelineConstructorParams<T>) {
        this.extractDate = params.extractDate;
        this.extractEvent = params.extractEvent;
        this.extractTimelineSummary = params.extractTimelineSummary;
    }

    create(entities: T[]) {
        const groupedEntities = {};

        entities.forEach((entity) => {
            const event = this.extractEvent(entity);
            const date = this.extractDate(entity);

            if(!groupedEntities[date]) {
                groupedEntities[date] = [event];
            } else {
                groupedEntities[date].push(event);
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
        extractDate: (commit: MinimalComitsData) => commit.date,
        extractEvent: (commit: MinimalComitsData) => ({
            summary: `${commit.committerName} made changes at ${commit.time}`,
            date: commit.time,
            type: commit.committerName,
            author: commit.committerEmail,
            description: commit.message,
        }),
        extractTimelineSummary: (commitsByDate, date) => `${commitsByDate[date].length} commits on ${date}`,
    });

    const result = timeline.create(commits);

    const util = require('util');
    console.log('Result from timeline: ', util.inspect(result, false, 30));
    return result;
};

clientFunction();
