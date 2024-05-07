
const { create } = require('xmlbuilder2');

const arrayRegex = /_item_\d+$/

function formatAndroidResources(data) {
    const normalizedArray = normalizeStringArray(data.resources['string-array'])
    const resources = []
    resources.push(...data.resources.string)
    resources.push(...normalizedArray)
    return resources
}

function buildAndroidResources(data, keyId = 'name') {
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

    return xmlBuilderMap
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

function normalizeStringArray(stringArray) {
    const normalized = []
    stringArray.forEach(array => {
        array.item.forEach((value, index) => {
            normalized.push({
                _: value,
                $: {
                    name: `${array.$.name}_item_${index + 1}`
                }
            })
        })
    })
    return normalized
}

module.exports = { formatAndroidResources, buildAndroidResources };