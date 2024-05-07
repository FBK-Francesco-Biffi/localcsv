const fs = require('fs');

function parseJSON(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            const parsed = JSON.parse(data);
            resolve(parsed);
        });
    })
}

module.exports = { parseJSON };