const fs = require('fs');
const xml2js = require('xml2js');

function parseXML(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    })
}

module.exports = { parseXML };