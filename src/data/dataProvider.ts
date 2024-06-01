import type { MinimalComitsData, MinimalHeartDiseaseData } from "../types/types";

const INPUT_FILE_PATH = './output/OneThousandCommits.json';

const readDataFromfile = (filePath = INPUT_FILE_PATH, clearCache = false) => {
    const fs = require('fs');

    const dataAsJson = fs.readFileSync(require.resolve(filePath), {
        encoding: 'utf-8',
        flag: 'r'
    });

    const data = JSON.parse(dataAsJson).flat();

    return data;
};

const fetchMinimalCommitsData = (numberOfCommits = 100): MinimalComitsData[] => {
    const commits = readDataFromfile().slice(0, numberOfCommits);

    return commits.map((commitData) => ({
        committerName: commitData.commit.committer.name,
        committerEmail: commitData.commit.committer.email,
        date: commitData.commit.committer.date.slice(0, 10),
        time: commitData.commit.committer.date.slice(11, 19),
        message: commitData.commit.message,
    } as MinimalComitsData));
};

const fetchMinimalHeartDiseaseData = (numberOfPatients = 100, filterByOutcome = false, hadHeartDisease = 1): MinimalHeartDiseaseData[] => {
    let cases = readDataFromfile('./output/heart_dataset.json').slice(0, numberOfPatients);
    
    console.log('Params: ', numberOfPatients, filterByOutcome, hadHeartDisease);

    if(filterByOutcome) {
        cases = cases.filter(c => c.target == hadHeartDisease);
    }
    
    const result = cases.map((caseData) => ({
        age: caseData.age,
        sex: caseData.sex ? 'Male': 'Female',
        chestPainType: caseData.cp,
        cholesterol: caseData.chol,
        highFastingBloodSugar: caseData.fbs,
    }));

    // console.log('Fetched cases: ', result);

    return result;
};

module.exports = {
    fetchMinimalCommitsData,
    fetchMinimalHeartDiseaseData,
};
