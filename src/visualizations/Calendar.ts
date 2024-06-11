import { MinimalCommitsData, MinimalHeartDiseaseData } from "../types/types";

class Calendar<T> {
    extractDateField: (it: T) => string;
    categories: string[];
    determineCategory: (numberOfOccurences: number) => string;

    constructor(
        extractDateField: (it: T) => string,
        categories: string[],
        determineCategory: (numberOfOccurences: number) => string
    ) {
        this.extractDateField = extractDateField;
        this.categories = categories;
        this.determineCategory = determineCategory;
    }

    create(inputEntities: T[]) {
        const datesMap = new Map<string, number>();
    
        inputEntities.forEach(entity => {
            const currentDate = this.extractDateField(entity)

            if(datesMap.has(currentDate)) {
                datesMap.set(currentDate, datesMap.get(currentDate) + 1);
            } else {
                datesMap.set(currentDate, 1);
            }
        });
        
        const mappedData: { date: string, value: number, category: string }[] = [];
        datesMap.forEach((value, key) => {
            mappedData.push({
                date: key,
                value,
                category: this.determineCategory(value),
            })
        });
    
        return {
            legend: true,
            options: true,
            categories: this.categories,
            calendar: mappedData,
        }
    }
}

module.exports = {
    Calendar,
};

const commitsClientFunction = () => {
    const { fetchMinimalCommitsData } = require('../data/dataProvider');

    const email = 'ivan.kopeykin@gmail.com';
    
    const commits: MinimalCommitsData[] = fetchMinimalCommitsData()
        .filter((commit: MinimalCommitsData) => commit.committerEmail === email);

    const determineCategory = (numberOfCommits: number): string => {
        if(numberOfCommits === 1) {
            return 'Difficult day';
        } else if (numberOfCommits > 1 && numberOfCommits < 3) {
            return 'Average day';
        } else {
            return 'Productive day';
        }
    }

    const calendar = new Calendar<MinimalCommitsData>(
        (commit: MinimalCommitsData) => commit.date,
        ['Difficult Day', 'Average Day', 'Productive Day'],
        determineCategory,
    )

    const result = calendar.create(commits);

    console.log('Calendar created result: \n', result);

    return result;
};

// const clinicalClientFunction = () => {
//     const { fetchMinimalHeartDiseaseData } = require('../data/dataProvider');

//     const clinicalCases = fetchMinimalHeartDiseaseData(400, true, 0);

//     const calendar = new Calendar<MinimalHeartDiseaseData>(

//     );
// };

commitsClientFunction();
// clinicalClientFunction();
