if(process.argv.length < 3) {
    console.log('Please provide the visualization type.');
    console.log('Accepter visualizations: BarchartView, LinechartView, CalendarView, PiechartView, TimelineView');
    exit(1);
}

let visualizationName = process.argv[2];

const { mapCommitsToVisualizationOfType } = require('./index');

const options = {};
if(visualizationName === 'LinechartView') {
    visualizationName = 'BarchartView';
    options.type = 'line';
}

const createVisualizationOfType = (type, options) => {
    const axios = require('axios');

    axios.post('http://localhost:8000/visualization', {
        visualization: mapCommitsToVisualizationOfType(type, options),
    })
    .then((response) => {
        console.log('Got axios response: ', response.data);
    });
};

createVisualizationOfType(visualizationName, options);

// mapCommitsToVisualizationOfType(visualizationName, options);