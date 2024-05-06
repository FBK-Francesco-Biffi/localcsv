const { Parser } = require('@json2csv/plainjs/index.js');
const { parseXML } = require('./XMLUtils');
const debug = require('debug')('parser');

function parseAndroidResources(filePath) {
    return new Promise((resolve, reject) => {
        parseXML(filePath)
            .then(data => {
                debug.enabled = true
                const strings = normalizeStringArray(data.resources['string-array'])
                const resources = []
                resources.push(...data.resources.string)
                resources.push(...strings)
                resolve(resources)  
            })
            .catch(reject) 
    })
}

function normalizeStringArray(stringArray) {
    const strings = []
    stringArray.forEach(array => {
        array.item.forEach((value, index) => {
            strings.push({
                _: value,
                $: {
                    name: `${array.$.name}_item_${index + 1}`
                }
            })
        })
    })
    return strings
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

module.exports = { parseAndroidResources, mapToRawCSV };