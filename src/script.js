if(process.argv.length < 3) {
    console.log('Please provide the visualization type.');
    console.log('Accepter visualizations: BarchartView, LinechartView, CalendarView, PiechartView, TimelineView');
    exit(1);
}

let visualizationName = process.argv[2];

const { mapCommitsToVisualizationsOfType } = require('./index');
// TO DO: const axios = require('axios');

const options = {};
if(visualizationName === 'LinechartView') {
    visualizationName = 'BarchartView';
    options.type = 'line';
}

mapCommitsToVisualizationsOfType(visualizationName, options);