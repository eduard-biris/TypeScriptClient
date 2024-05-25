import { Visualization } from "./types/types";

const { mapCommitsToNumberByUserByDate: barChartMapper } = require('./mappers/barChartMapper');
const { mapCommitsToCalendarForUser: calendarMapper } = require('./mappers/calendarMapper');
const { mapCommitsToNumberOfCommitByUser: piechartMapper } = require('./mappers/pieChartMapper');
const { mapCommitsToTimeline: timelineMapper } = require('./mappers/timelineMapper');

type SupportedTypesEnum =
    'TimelineView' |
    'CalendarView' |
    'BarchartView' |
    'PiechartView'
;

const mapCommitsToVisualizationsOfType = (type: SupportedTypesEnum, options?: any) => {
    const mappers = {
        'BarchartView': barChartMapper,
        'CalendarView': calendarMapper,
        'PiechartView': piechartMapper,
        'TimelineView': timelineMapper,
    };

    const result: Visualization = {
        type,
        data: mappers[type](options ?? {}),
    };
    
    const util = require('util');
    console.log('Result: ', util.inspect(result, false, 30));
    return result;
};

// mapCommitsToVisualizationsOfType('BarchartView', { type: 'line' });

module.exports = {
    mapCommitsToVisualizationsOfType,
};