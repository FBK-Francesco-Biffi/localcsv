const fs = require('fs');
const xml2js = require('xml2js');
const { create } = require('xmlbuilder2');
const debug = require('debug')('XMLUtils');

const arrayRegex = /_item_\d+$/

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
    const arraySupportMap = {}
    data.forEach(row => {
        const itemKey = row[keyId]
        if(arrayRegex.test(itemKey)) {
            attachArrayElement(xmlBuilderMap, row, keyId, itemKey, arraySupportMap)
        } else {
            attachStringElement(xmlBuilderMap, row, keyId, itemKey)
        }
    });

    Object.keys(xmlBuilderMap).forEach(key => {
        const xmlBuilder = xmlBuilderMap[key]
        const xmlString = xmlBuilder.end({ prettyPrint: true });
        const fileName = `${outputDir}_${key}.xml`
        fs.writeFileSync(fileName, xmlString, 'utf-8');
    })  

    console.log('File XML creati con successo.');
}

function attachArrayElement(xmlBuilderMap, row, keyId, itemKey, arraySupportMap) {
    const name = itemKey.replace(arrayRegex, '')
    Object.keys(row)
        .filter(key => key !== keyId)
        .forEach(key => {
            const arrayBuilderTag = `${name}_${key}`
            if(itemKey.substring(itemKey.length-2) === "_1") {
                const xmlBuilder = xmlBuilderMap[key]
                arraySupportMap[arrayBuilderTag] = xmlBuilder
                    .ele('string-array')
                    .att('name', name)
            }
            const arrayBuilder = arraySupportMap[arrayBuilderTag]
            arrayBuilder
                .ele('item')
                .txt(row[key])
        })
}

function attachStringElement(xmlBuilderMap, row, keyId, name) {
    Object.keys(row)
        // Ignore the column with KeyId because it contains the keys of each resource (extracted in the itemKey variable)
        .filter(key => key !== keyId)
        .forEach(key => {
            xmlBuilderMap[key]
                .ele('string')
                .att('name', name)
                .txt(row[key])
        });
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