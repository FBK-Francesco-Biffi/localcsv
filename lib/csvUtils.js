const fs = require('fs');
const csvParser = require('csv-parser');
const { formatValues } = require("./formatters")
const { Parser } = require('@json2csv/plainjs/index.js');

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

function writeCSV(data, outputPath, separator = ',', encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
        const csvWriter = fs.createWriteStream(outputPath, encoding);
        csvWriter.on('error', reject);
        // Write headers
        csvWriter.write(`${Object.keys(data[0]).join(separator)}\n`);
        // Write data
        data.forEach(item => {
            const formattedItem = formatValues(item)
            csvWriter.write(`${formattedItem.join(separator)}\n`);
        });
        csvWriter.end();
        csvWriter.on('finish', resolve);
    });
}

function mapToRawCSV(map, headers) {
    const csvData = Object.keys(map).map(name => {
        return headers.slice(1).reduce((acc, header) => {
            acc[header] = map[name][header] || '';
            return acc;
        }, { [headers[0]]: name });
    });
    const parser = new Parser({ fields: headers });
    return parser.parse(csvData);
}

function writeRawCSV(rawCSV, outputPath) {
    return fs.promises.writeFile(outputPath, rawCSV, 'utf-8');
}

module.exports = { parseCSV, writeCSV, mapToRawCSV, writeRawCSV };
