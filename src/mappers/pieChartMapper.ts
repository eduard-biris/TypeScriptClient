// ===== PiechartView mock props =====
// const data = {
//   values: {
//     'Statistic 1': 122,
//     'Statistic 2': 222,
//     'Statistic 3': 510,
//     'Statistic 4': 320
//   }
// };
// const legend = true;
// const options = true;
// const filter = true;

import { MinimalComitsData, NamedMap } from "../types/types";

const condenseSmallestGroups = (commitsMap: Map<string, number>): Map<string, number> => {
    const values = [...commitsMap.entries()].sort((a, b) => a[1] - b[1]);

    let othersCount = 0;
    while(values.length > 6) {
        othersCount += values.shift()[1];
    }

    values.push(['Others', othersCount]);
    return new Map(values);
};

const countCommitsByUser = (commits: MinimalComitsData[]) => {
    let commitsMap = new Map<string, number>();

    commits.forEach((commit) => {
        if(commitsMap.has(commit.committerName)) {
            commitsMap.set(commit.committerName, commitsMap.get(commit.committerName) + 1);
        } else {
            commitsMap.set(commit.committerName, 1);
        }
    });

    if(commitsMap.size > 7) {
        commitsMap = condenseSmallestGroups(commitsMap);
    }

    const result: NamedMap<number> = {};
    commitsMap.forEach((value, key) => {
        result[key] = value;
    });

    return result;
};

const mapCommitsToNumberOfCommitByUser = ({ legend = true, options = true, filter = true }) => {
    const { fetchMinimalCommitsData } = require('../data/dataProvider');
    const commits: MinimalComitsData[] = fetchMinimalCommitsData(1000);

    const result = countCommitsByUser(commits);
    return {
        data: {
            values: result,
        },
        legend,
        options,
        filter,
    };
};

// mapCommitsToNumberOfCommitByUser();

module.exports = {
    mapCommitsToNumberOfCommitByUser,
};
