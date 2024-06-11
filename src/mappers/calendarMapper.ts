// ===== CalendarView mock props =====

// The Categories shoulb the actual users => different colors for different users
// const categories = [ '1', '2', '3', '5', '6', '7' ];

// This shouldn't be difficult to implement:
/*
    date: the date present in the author field of the commit can be used -> just needs a little trimming
    value: ??? I am not sure what this is -> provide 1 to all of them in the beginning
    category: this should be the name or the email of the user -> see categories
*/
// const calendar = [
//   { date: '1939-09-02', value: 1, category: '1' },
//   { date: '1939-09-07', value: 1, category: '2' },
//   { date: '1939-09-17', value: 1, category: '3' },
//   { date: '1939-10-06', value: 1, category: '1' },
//   { date: '1939-10-07', value: 1, category: '1' },
//   { date: '1939-10-14', value: 1, category: '5' },
//   { date: '1939-10-17', value: 1, category: '1' },
//   { date: '1939-10-22', value: 1, category: '6' },
//   { date: '1939-10-28', value: 1, category: '1' },
//   { date: '1939-11-04', value: 1, category: '7' },
//   { date: '1939-11-28', value: 1, category: '3' },
//   { date: '1939-12-05', value: 1, category: '3' },
//   { date: '1939-12-11', value: 1, category: '2' },
//   { date: '1939-12-16', value: 1, category: '2' },
//   { date: '1939-12-23', value: 1, category: '1' }
// ];
// const legend = true;
// const options = true;

// const MapCommitsToCalendar = async () => {
//     axios.get('https://api.github.com/repos/webpack/webpack/commits')
//         .then((response) => {
//             const rawData = response.data;

//             const mappedData = [];

//             console.log('Number of commits: ', rawData.length);

//             const authorsSet = new Set();
//             const dates = [];

//             rawData.forEach(event => {
//                 authorsSet.add(event.commit.committer.email);
//                 dates.push(event.commit.committer.date.slice(0, 10));

//                 mappedData.push({
//                     date: event.commit.committer.date.slice(0, 10),
//                     category: event.commit.committer.email,
//                     value: 1,
//                 })
//             });

//             console.log('Set of authors: ', authorsSet);
//             console.log('Dates: ', dates);
//             console.log('=====');
//             console.log('Mapped data (result): ', mappedData);
//             console.log('=====');

//             console.log('Got data: ', util.inspect(rawData, false, 30, false));
//         })
//         .catch((error) => {
//             console.log('Got error while getting: ', error.stack);
//         });
// };

// const MapCommitsToCalendarForAUser = async () => {
//     axios.get('https://api.github.com/repos/webpack/webpack/commits?author=ivan.kopeykin@gmail.com&per_page=100')
//         .then((response) => {
//             const rawData = response.data;

//             const mappedData = [];

//             console.log('Number of commits: ', rawData.length);

//             const datesMap = new Map();

//             rawData.forEach(entry => {
//                 const currentCommitDate = entry.commit.committer.date.slice(0, 10);
//                 if(datesMap.has(currentCommitDate)) {
//                     datesMap.set(currentCommitDate, datesMap.get(currentCommitDate) + 1);
//                 } else {
//                     datesMap.set(currentCommitDate, 1);
//                 }
//             });

//             const determineCategory = (numberOfCommits) => {
//                 if(numberOfCommits === 1) {
//                     return 'Difficult day';
//                 } else if (numberOfCommits > 1 && numberOfCommits < 3) {
//                     return 'Average day';
//                 } else {
//                     return 'Productive day';
//                 }
//             }

//             console.log('Generated map: ', datesMap);
            
//             datesMap.forEach((value, key) => {
//                 mappedData.push({
//                     date: key,
//                     value,
//                     category: determineCategory(value),
//                 })
//             });

//             // console.log('Set of authors: ', authorsSet);
//             // console.log('Dates: ', dates);
//             console.log('=====');
//             console.log('Mapped data (result): ', mappedData);
//             console.log('=====');

//             console.log('Got data: ', util.inspect(rawData, false, 30, false));

//             return mappedData;
//         })
//         .catch((error) => {
//             console.log('Got error while getting: ', error.stack);
//         });
// };

// MapCommitsToCalendarForAUser();

import type { MinimalCommitsData } from "../types/types";

const mapCommitsToCalendarForUser = ({ email = 'ivan.kopeykin@gmail.com', options = true, legend = true }) => {
    const { fetchMinimalCommitsData } = require('../data/dataProvider');

    const commits: MinimalCommitsData[] = fetchMinimalCommitsData()
        .filter((commit: MinimalCommitsData) => commit.committerEmail === email);

    const datesMap = new Map<string, number>();

    commits.forEach(commit => {
        if(datesMap.has(commit.date)) {
            datesMap.set(commit.date, datesMap.get(commit.date) + 1);
        } else {
            datesMap.set(commit.date, 1);
        }
    });

    // This is just for the sake of demonstration, doesn't really make sense
    const determineCategory = (numberOfCommits: number): string => {
        if(numberOfCommits === 1) {
            return 'Difficult day';
        } else if (numberOfCommits > 1 && numberOfCommits < 3) {
            return 'Average day';
        } else {
            return 'Productive day';
        }
    }
    
    const mappedData: { date: string, value: number, category: string }[] = [];
    datesMap.forEach((value, key) => {
        mappedData.push({
            date: key,
            value,
            category: determineCategory(value),
        })
    });

    return {
        legend,
        options,
        categories: ['Difficult day', 'Average day', 'Productive day'],
        calendar: mappedData,
    }
};


// mapCommitsToCalendarForUser('ivan.kopeykin@gmail.com');

module.exports = {
    mapCommitsToCalendarForUser,
};