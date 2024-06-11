import { MinimalCommitsData } from "../types/types";

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
};

type TimelineConstructorParams<T> = {
    extractDate: (it: T) => string,
    extractEvent: (it: T) => TimelineEvent,
    extractTimelineSummary: (itGroup: Map<string, TimelineEvent[]>, groupName: string) => string
}

class Timeline<T> {
    extractDate: (it: T) => string;
    extractEvent: (it: T) => TimelineEvent;
    extractTimelineSummary: (itGroup: Map<string, TimelineEvent[]>, groupName: string) => string

    constructor(params: TimelineConstructorParams<T>) {
        this.extractDate = params.extractDate;
        this.extractEvent = params.extractEvent;
        this.extractTimelineSummary = params.extractTimelineSummary;
    }

    create(entities: T[]) {
        const groupedEntities = new Map<string, TimelineEvent[]>()

        entities.forEach((entity) => {
            const event = this.extractEvent(entity);
            const date = this.extractDate(entity);

            if(!groupedEntities.has(date)) {
                groupedEntities.set(date, [event]);
            } else {
                const currentEvents = groupedEntities.get(date);
                currentEvents.push(event);

                groupedEntities.set(date, currentEvents);
            }
        });
    
        const timelineData = {};
        groupedEntities.forEach((eventsInGroup, groupName) => {
            timelineData[groupName] = {
                summary: {
                    title: this.extractTimelineSummary(groupedEntities, groupName),
                },
                events: eventsInGroup,
            };
        });
    
        return {
            data: timelineData,
        };
    }
}



const clientFunction = () => {
    const timeline = new Timeline<MinimalCommitsData>({
        extractDate: (commit: MinimalCommitsData) => commit.date,
        extractEvent: (commit: MinimalCommitsData) => ({
            summary: commit.message,
            date: commit.time,
            type: commit.committerName,
            author: commit.committerEmail,
        }),
        extractTimelineSummary: (commitsByDate, date) => `${commitsByDate.get(date).length} commits on ${date}`,
    });

    const { fetchMinimalCommitsData } = require('../data/dataProvider');

    const commits = fetchMinimalCommitsData(100);

    const result = timeline.create(commits);

    const util = require('util');
    console.log('Result from timeline: ', util.inspect(result, false, 30));
    return result;
};

clientFunction();

module.exports = {
    Timeline,
    clientFunction,
}