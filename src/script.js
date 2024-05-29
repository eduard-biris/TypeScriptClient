if(process.argv.length < 4) {
    console.log('Please provide the visualization type and display name.');
    console.log('Accepted visualizations: BarchartView, LinechartView, CalendarView, PiechartView, TimelineView');
    console.log(`Usage: 
        ${process.argv[1]} <visualization_type> <display_name>`
    );
    process.exit(1);
}

let visualizationName = process.argv[2];
let displayName = process.argv[3];

const { mapCommitsToVisualizationOfType } = require('./index');

const options = {};
if(visualizationName === 'LinechartView') {
    visualizationName = 'BarchartView';
    options.type = 'line';
}

const createVisualizationOfType = (type, options) => {
    const axios = require('axios');

    axios.post('http://localhost:8000/visualization', {
        visualization: {
            name: displayName,
            ...mapCommitsToVisualizationOfType(type, options),
        },
    })
    .then((response) => {
        console.log('Got axios response: ', response.data);
    });
};

createVisualizationOfType(visualizationName, options);

// mapCommitsToVisualizationOfType(visualizationName, options);