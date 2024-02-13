const fs = require('fs');
const csvParser = require('csv-parser');
const { formatValues } = require("./formatters")

function parseCSV(filePath) {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

function writeCSV(data, outputPath) {
    return new Promise((resolve, reject) => {
        const csvWriter = fs.createWriteStream(outputPath);
        csvWriter.on('error', reject);
        // Write headers
        csvWriter.write(`${Object.keys(data[0]).join(',')}\n`);
        // Write data
        data.forEach(item => {
            const formattedItem = formatValues(item)
            csvWriter.write(`${formattedItem.join(',')}\n`);
        });
        csvWriter.end();
        csvWriter.on('finish', resolve);
    });
}

module.exports = { parseCSV, writeCSV };
