import type { MinimalComitsData } from "../types/types";

const INPUT_FILE_PATH = './output/OneThousandCommits.json';

let commitsFromFile: any[];

const readCommitsFromFile = (filePath = INPUT_FILE_PATH, clearCache = false) => {
    if(!clearCache && commitsFromFile) return commitsFromFile;

    const fs = require('fs');

    const commitsAsJson = fs.readFileSync(require.resolve(filePath), {
        encoding: 'utf-8',
        flag: 'r'
    });

    commitsFromFile = JSON.parse(commitsAsJson).flat();

    return commitsFromFile;
};

const fetchMinimalCommitsData = (numberOfCommits = 100): MinimalComitsData[] => {
    const commits = readCommitsFromFile().slice(0, numberOfCommits);

    return commits.map((commitData) => ({
        committerName: commitData.commit.committer.name,
        committerEmail: commitData.commit.committer.email,
        date: commitData.commit.committer.date.slice(0, 10),
        time: commitData.commit.committer.date.slice(11, 19),
        message: commitData.commit.message,
    } as MinimalComitsData));
};

module.exports = {
    fetchMinimalCommitsData,
};
