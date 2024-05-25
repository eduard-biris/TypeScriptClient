
// ===== TimelineView mock props =====
// const data = {
//   "2023-10-07": {
//     "summary": {
//       "title": "Sample Timeline"
//     },
//     "events": [
//       {
//         "summary": "Event 1",
//         "date": "08:00:00",
//         "type": "Type A",
//         "author": "Author 1",
//         "tags": [
//           {
//             "name": "Tag A"
//           }
//         ],
//         "description": "Description of Event 1"
//       },
//       {
//         "summary": "Event 2",
//         "date": "09:00:00",
//         "type": "Type B",
//         "author": "Author 2"
//       }
//     ]
//   },
//   "2023-10-10": {
//     "summary": {
//       "title": "Sample Timeline"
//     },
//     "events": [
//       {
//         "summary": "Event 3",
//         "date": "09:00:00",
//         "type": "Type C",
//         "author": "Author 3"
//       },
//       {
//         "summary": "Event 4",
//         "date": "10:00:00",
//         "type": "Type D",
//         "author": "Author 4"
//       },
//       {
//         "summary": "Event 5",
//         "date": "10:00:00",
//         "type": "Type E",
//         "author": "Author 5"
//       }
//     ]
//   },
//   "2023-10-08": {
//     "summary": {
//       "title": "Sample Timeline"
//     },
//     "events": [
//       {
//         "summary": "Event 6",
//         "date": "11:00:00",
//         "type": "Type F",
//         "author": "Author 6"
//       },
//       {
//         "summary": "Event 7",
//         "date": "11:00:00",
//         "type": "Type G",
//         "author": "Author 7"
//       },
//       {
//         "summary": "Event 8",
//         "date": "12:00:00",
//         "type": "Type H",
//         "author": "Author 8"
//       }
//     ]
//   },
//   "2023-10-06 ": {
//     "summary": {
//       "title": "Sample Timeline"
//     },
//     "events": [
//       {
//         "summary": "Event 9",
//         "date": "12:00:00",
//         "type": "Type I",
//         "author": "Author 9"
//       },
//       {
//         "summary": "Event 10",
//         "date": "13:00:00",
//         "type": "Type J",
//         "author": "Author 10"
//       }
//     ]
//   }
// };


import type { MinimalComitsData } from "../types/types";

const groupCommitsByDate = (commits: MinimalComitsData[]) => {
    const groupedCommits = {};

    commits.forEach((commitData) => {
        const desiredInfo = {
            summary: `${commitData.committerName}: ${commitData.message}`,
            date: commitData.time,
            author: commitData.committerEmail,
            type: commitData.committerName
        };

        if(!groupedCommits[commitData.date]) {
            groupedCommits[commitData.date] = [desiredInfo];
        } else {
            groupedCommits[commitData.date].push(desiredInfo);
        }
    });

    return groupedCommits;
};

const mapCommitsToTimeline = () => {
    const { fetchMinimalCommitsData } = require('../data/dataProvider');

    const commits = fetchMinimalCommitsData(100);

    const commitsByDate = groupCommitsByDate(commits);

    const timelineData = {};
    Object.keys(commitsByDate).forEach((commitDate) => {
        timelineData[commitDate] = {
            summary: {
                title: `${commitsByDate[commitDate].length} commits on ${commitDate}`,
            },
            events: commitsByDate[commitDate],
        };
    });
    return timelineData;
};

// mapCommitsToTimeline();

module.exports = {
    mapCommitsToTimeline,
}