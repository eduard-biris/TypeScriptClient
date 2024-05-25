const axios = require('axios');
const fs = require('fs');

const fetchCommits = async ({
    owner,
    repository,
    numberOfCommits, // between 1 and 100
    page,
    author
}) => new Promise((resolve, reject) => {
    const requestUrl = `https://api.github.com/repos/${owner}/${repository}/commits?\
        ${numberOfCommits ? 'per_page=' + numberOfCommits + '/': ''}\
        ${page ? '&page=' + page: ''}\
        ${author ? '&author=' + author: ''}`.replaceAll(/ /g, '');

    axios.get(requestUrl)
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            reject(error);
        });
});

const fetchOneThounsandCommitsFromWebpack = async () => {
    const responsePromises = [];
    for(let pageNumber=0; pageNumber<10; ++pageNumber) {
        responsePromises.push(fetchCommits({
            owner: 'webpack',
            repository: 'webpack',
            numberOfCommits: 100,
            page: pageNumber
        }));
    }

    const paginatedCommits = await Promise.all(responsePromises);
    
    fs.writeFileSync('OneThousandCommits.json', JSON.stringify(paginatedCommits, null, 2), 'utf-8');
};

// fetchOneThounsandCommitsFromWebpack();

module.exports = {
    fetchCommits,
    fetchOneThounsandCommitsFromWebpack,
};
