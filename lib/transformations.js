const { replaceSpecialCharacter, replaceHTMLUnicodeCharacters } = require('./formatters');

// FROM CSV

const csvToIOS = (data) => {
    // CSV to IOS transformations
    let newData = csvToCommon(data);
    newData = replaceSpecialCharacter(newData, /\{(\d+)s\}/g, '%$1$@');
    newData = replaceSpecialCharacter(newData, "{s}", "%@");
    return newData;
};
  
const csvToAndroid = (data) => {
    // CSV to Android transformations
    let newData = csvToCommon(data);
    newData = replaceSpecialCharacter(newData, /\{(\d+)s\}/g, '%$1$s');
    newData = replaceSpecialCharacter(newData, "{s}", "%s");
    newData = replaceSpecialCharacter(newData, /\*\*(.*?)\*\*/g, '&lt;b&gt;$1&lt;/b&gt;')
    return newData;
};

const csvToCommon = (data) => {
    // Common from CSV transformations
    let newData = replaceSpecialCharacter(data, /\{(\d+)f\}/g, '%$1$f');
    newData = replaceSpecialCharacter(newData, /\{(\d+)d\}/g, '%$1$d');
    newData = replaceSpecialCharacter(newData, String.fromCharCode(parseInt(8230, 10)), '&#8230;')
    newData = replaceSpecialCharacter(newData, /\.\.\./g, '&#8230;')
    return newData;
}

// TO CSV

const iosToCSV = (data) => {
    // IOS to CSV transformations
    let newData = commonToCSV(data);
    newData = replaceSpecialCharacter(newData, /\%(\d+)\$@/g, '{$1s}');
    newData = replaceSpecialCharacter(newData, "%@", "{s}");
    return newData;
}

const androidToCSV = (data) => {
    // Android to CSV transformations
    let newData = commonToCSV(data);
    newData = replaceSpecialCharacter(newData, /\%(\d+)\$s/g, '{$1s}');
    newData = replaceSpecialCharacter(newData, "%s", "{s}");
    newData = replaceSpecialCharacter(newData, '&lt;b&gt;|&lt;/b&gt;', '**');
    return newData;
}

const commonToCSV = (data) => {
   // Common to CSV transformations
   let newData = replaceSpecialCharacter(data, /\%(\d+)\$f/g, '{$1f}');
   newData = replaceSpecialCharacter(newData, /\%(\d+)\$d/g, '{$1d}');
   newData = replaceHTMLUnicodeCharacters(newData)
   return newData;
}
  
module.exports = { csvToIOS, csvToAndroid, iosToCSV, androidToCSV };
  