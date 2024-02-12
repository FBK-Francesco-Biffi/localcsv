
const mapValueWithCommas = value => value.includes(',') ? `"${value}"` : value;

const mapEmptyValue = value => value === '' ? '""' : value;

const doubleQuote = value => value.replace(/"/g, '""')

function replaceSpecialCharacter(data, specialChar, replacement) {
    const newData = [];
    data.forEach(item => {
        const newItem = {};
        for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
                let translatedValue = item[key].replace(new RegExp(specialChar, 'g'), replacement);
                newItem[key] = translatedValue;
            }
        }
        newData.push(newItem);
    });
    return newData;
}

function formatValues(item) {
    return Object.values(item)
        .map(doubleQuote)
        .map(mapValueWithCommas)
        .map(mapEmptyValue);
}

module.exports = { replaceSpecialCharacter, formatValues };
