#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const { csvToIOS, csvToAndroid, iosToCSV, androidToCSV } = require('../lib/transformations');
const { parseCSV, writeCSV, writeRawCSV } = require('../lib/csvUtils');
const { parseJSON } = require('../lib/JSONUtils');
const { parseAndroidResources, mapToRawCSV } = require('../lib/parsers')
const { writeXML } = require('../lib/XMLUtils')
const debug = require('debug')('localcsv');

program
    .name('localcsv')
    .version('0.0.3')
    .description('Localization CLI to handle special characters between multiple platforms')
    
program
    .command('csv2ios')
    .argument('<file>', 'File to transform')
    .description('Transforms a Generic CSV file into an IOS CSV File')
    .option('-o, --output <output>', 'Specifies the path to the output CSV file', "transformed-ios.csv")
    .option('-d, --debug', 'Abilita la modalità di debug')
    .action((file, options) => {
        transformCSV(file, options, csvToIOS)
    })

program
    .command('csv2android')
    .argument('<file>', 'File to transform')
    .description('Transforms a Generic CSV file into an Android CSV File')
    .option('-o, --output <output>', 'Specifies the path to the output CSV file', "transformed-android.csv")
    .option('-d, --debug', 'Abilita la modalità di debug')
    .action((file, options) => {
        transformCSV(file, options, csvToAndroid)
    })

program
    .command('ios2csv')
    .argument('<file>', 'File to transform')
    .description('Transforms an IOS CSV file into a Generic CSV File')
    .option('-o, --output <output>', 'Specifies the path to the output CSV file', "transformed-generic.csv")
    .option('-d, --debug', 'Abilita la modalità di debug')
    .action((file, options) => {
        transformCSV(file, options, iosToCSV)
    })

program
    .command('android2csv')
    .argument('<file>', 'File to transform')
    .description('Transforms an Android CSV file into a Generic CSV File')
    .option('-o, --output <output>', 'Specifies the path to the output CSV file', "transformed-generic.csv")
    .option('-d, --debug', 'Abilita la modalità di debug')
    .action((file, options) => {
        transformCSV(file, options, androidToCSV)
    })

program
    .command('parseAndroidRes')
    .description('Parse Android Resource Files')
    .option('-o, --output <output>', 'Specifies the path to the output file', "android-resources.csv")
    .option('-d, --debug', 'Abilita la modalità di debug')
    .action((options) => {
        createResourceCSV(options)
    })

program
    .command('csv2AndroidRes')
    .argument('<file>', 'File to transform')
    .description('Convert CSV file to Android Resources')
    .option('-d, --debug', 'Abilita la modalità di debug')
    .action((file, options) => {
        createResourceXML(file, options)
    })

program.parse(process.argv)

if (program.args.length === 0) {
    program.help();
}

function transformCSV(file, options, transformer) {
    console.log(options)
    debug.enabled = options.debug || false
    parseCSV(file)
        .then((data) => {
            debug(data)
            const transformedData = transformer(data)
            debug(transformedData)
            return writeCSV(transformedData, options.output);
        })
        .then(() => {
            console.log(`Modified data written on: ${options.output}`);
        })
        .catch((error) => {
            console.error(`An error occurred while parsing the CSV file:`, error);
        });
}

function createResourceCSV(options) {
    parseJSON('localcsv-config.json').then(config => {
        console.log(options)
        debug.enabled = options.debug || false
        const translationFiles = config.translationFiles
        const headers = config.headers ? config.headers : createDefaultHeaders(translationFiles)
        const translationsMap = {};

        return Promise.all(translationFiles.map(filePath => {
            return parseAndroidResources(filePath)
                .then(strings => {
                    strings.forEach(string => {
                        const name = string.$.name;
                        const value = string._;
                        translationsMap[name] = translationsMap[name] || {};
                        const index = translationFiles.indexOf(filePath) + 1;
                        const header = headers[index];
                        translationsMap[name][header] = value;
                    });
                });
        }))
        .then(() => {
            debug(translationsMap)
            const rawCSV = mapToRawCSV(translationsMap, headers)
            //debug(rawCSV)
            writeRawCSV(rawCSV, options.output)
        })
        .then(() => {
            console.log(`Parsed data written on: ${options.output}`);
        })
        .catch(err => {
            console.error('Error:', err.message);
        });
    })
    .catch(err => {
        console.error('Error:', err.message);
    });
}

async function createResourceXML(file, options) {
    console.log(options)
    try {
        const config = await parseJSON('localcsv-config.json')
        const translationFiles = config.translationFiles
        const headers = config.headers ? config.headers : createDefaultHeaders(translationFiles)
        const csvData = await parseCSV(file);
        writeXML(csvData, "generated", headers[0]);
    } catch (error) {
        console.error('Si è verificato un errore durante la conversione:', error);
    }
}

function createDefaultHeaders(translationFiles) {
    const headers = ["name"]
    translationFiles.forEach(filePath => {
        const index = translationFiles.indexOf(filePath) + 1
        const header = `translation_${index}`
        headers.push(header)
    })
    return headers
}


