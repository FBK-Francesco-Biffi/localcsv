const fs = require('fs');
const xml2js = require('xml2js');
const { create } = require('xmlbuilder2');
const debug = require('debug')('XMLUtils');

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

function writeXML(data, outputDir, keyId = 'name') {
    debug.enabled = true
    //Create files based on the first row keys
    const xmlBuilderMap = createXMLBuilderMap(data[0], keyId)
    data.forEach(row => {
        let itemKey = row[keyId]
        Object.keys(row).forEach(key => {
            // Ignore the column with KeyId because it contains the keys of each resource (extracted in the itemKey variable)
            if (key !== keyId) {
                const item = xmlBuilderMap[key].ele('string')
                item.att('name', itemKey)
                item.txt(row[key])
            }
        });
    });

    Object.keys(xmlBuilderMap).forEach(key => {
        const xmlBuilder = xmlBuilderMap[key]
        const xmlString = xmlBuilder.end({ prettyPrint: true });
        const fileName = `${outputDir}_${key}.xml`
        fs.writeFileSync(fileName, xmlString, 'utf-8');
    })  

    console.log('File XML creati con successo.');
}

function createXMLBuilderMap(row, keyId = 'name') {
    const fileMap = {}
    Object.keys(row).forEach(key => {
        if(key !== keyId) {
            fileMap[key] = create().ele('resources')
        }
    })
    return fileMap
}

module.exports = { parseXML, writeXML };