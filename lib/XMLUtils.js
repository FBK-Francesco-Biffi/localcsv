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

function writeXMLSync(xmlBuilder, filePath) {
    const xmlString = xmlBuilder.end({ prettyPrint: true });
    const fileName = `${filePath}.xml`
    fs.writeFileSync(fileName, xmlString, 'utf-8');
}



module.exports = { parseXML, writeXMLSync };