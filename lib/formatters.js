
const mapValueWithCommas = value => value.includes(',') ? `"${value}"` : value;

const mapEmptyValue = value => value === '' ? '""' : value;

const doubleQuote = value => value.replace(/"/g, '""')

function replaceSpecialCharacter(data, specialChar, replacement) {
    return formatData(data, getReplaceSpecialCharacter(specialChar, replacement))
}

function replaceHTMLUnicodeCharacters(data) {
    return formatData(data, getHTMLUnicodeReplacement())
}

function formatData(data, formatter) {
    const newData = [];
    data.forEach(item => {
        const newItem = {};
        for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
                newItem[key] = formatter(item[key]);
            }
        }
        newData.push(newItem);
    });
    return newData;
}

function getReplaceSpecialCharacter(specialChar, replacement) {
    return (string) => string.replace(new RegExp(specialChar, 'g'), replacement)
}

function getHTMLUnicodeReplacement() {
    return (string) => 
        string.replace(/&#[xX]([0-9A-Fa-f]+);|&#(\d+);/g, (_, hexValue, decValue) => {
            if (hexValue !== undefined) {
                return String.fromCharCode(parseInt(hexValue, 16));
            } else if (decValue !== undefined) {
                return String.fromCharCode(parseInt(decValue, 10));
            }
        });
}

function formatValues(item) {
    return Object.values(item)
        .map(doubleQuote)
        .map(mapValueWithCommas)
        .map(mapEmptyValue);
}

module.exports = { replaceSpecialCharacter, replaceHTMLUnicodeCharacters, formatValues, formatData };
