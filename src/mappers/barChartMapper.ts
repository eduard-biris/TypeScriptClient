// ===== BarchartView mock props =====
// const barData = {
//     "headers": [
//       "Mon",
//       "Tue",
//       "Wed",
//       "Thu",
//       "Fri",
//       "Sat",
//       "Sun"
//     ],
//     "values": {
//       "Statistic 1": [
//         120,
//         132,
//         101,
//         134,
//         90,
//         230,
//         210
//       ],
//       "Statistic 2": [
//         220,
//         182,
//         191,
//         234,
//         290,
//         330,
//         310
//       ],
//       "Statistic 3": [
//         150,
//         232,
//         201,
//         154,
//         190,
//         330,
//         410
//       ],
//       "Statistic 4": [
//         320,
//         332,
//         301,
//         334,
//         390,
//         330,
//         320
//       ]
//     }
//   };

import type { MinimalCommitsData, NamedMap } from '../types/types';

const groupNumberOfCommitsByDate = (commits: MinimalCommitsData[]) => {
    const result: NamedMap<NamedMap<number>> = {};

    commits.forEach((commit) => {
        if(!result[commit.date]) {
            result[commit.date] = {};
        }

        if(!result[commit.date][commit.committerName]) {
            result[commit.date][commit.committerName] = 0;
        }

        result[commit.date][commit.committerName] += 1;
    });

    const resultWithReducedNumberOfDates: typeof result = {};
    Object.keys(result).forEach((key, index) => {
        if(index > 6) return;

        resultWithReducedNumberOfDates[key] = result[key];
    });

    return resultWithReducedNumberOfDates;
};

const mapDataToChartInputType = (commitsData: NamedMap<NamedMap<number>>) => {
    let result: NamedMap<number[]> = {};
    let authors = new Set<string>();

    for(let date in commitsData) {
        for(let author in commitsData[date]) {
            authors.add(author);

            if(!result[author]) {
                result[author] = [];
            }
        }
    }

    for(let date in commitsData) {
        for(let author of authors) {
            if(commitsData[date][author]) {
                result[author].push(commitsData[date][author]);
            } else {
                result[author].push(0);
            }
        }
    }

    return {
        headers: Object.keys(commitsData),
        values: result,
    };
};

const mapCommitsToNumberByUserByDate = ({ legend = true, options = true, type = 'bar' }) => {
    const { fetchMinimalCommitsData } = require('../data/dataProvider');

    const commits: MinimalCommitsData[] = fetchMinimalCommitsData();
    const numberOfCommitsByDate = groupNumberOfCommitsByDate(commits);

    const result = mapDataToChartInputType(numberOfCommitsByDate);

    return {
        data: result,
        legend,
        options,
        type,
    }
};

// mapCommitsToNumberByUserByDate();

module.exports = {
    mapCommitsToNumberByUserByDate,
};
