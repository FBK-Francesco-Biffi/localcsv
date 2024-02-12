#!/usr/bin/env node

const { program } = require('commander');
const { csvToIOS, csvToAndroid, iosToCSV, androidToCSV } = require('../lib/transformations');
const { parseCSV, writeCSV } = require('../lib/csvUtils');
const debug = require('debug')('localcsv');

program
    .version('0.0.1')
    .description('Localization CLI to handle special characters between multiple platforms')
    
program
    .command('csv2ios <file>')
    .description('Transforms a Generic CSV file into an IOS CSV File')
    .option('-o, --output <output>', 'Specifies the path to the output CSV file', "transformed-ios.csv")
    .option('-d, --debug', 'Abilita la modalità di debug')
    .action((file, options) => {
        execute(file, options, csvToIOS)
    })

program
    .command('csv2android <file>')
    .description('Transforms a Generic CSV file into an Android CSV File')
    .option('-o, --output <output>', 'Specifies the path to the output CSV file', "transformed-android.csv")
    .option('-d, --debug', 'Abilita la modalità di debug')
    .action((file, options) => {
        execute(file, options, csvToAndroid)
    })

program
    .command('ios2csv <file>')
    .description('Transforms an IOS CSV file into a Generic CSV File')
    .option('-o, --output <output>', 'Specifies the path to the output CSV file', "transformed-generic.csv")
    .option('-d, --debug', 'Abilita la modalità di debug')
    .action((file, options) => {
        execute(file, options, iosToCSV)
    })

program
    .command('android2csv <file>')
    .description('Transforms an Android CSV file into a Generic CSV File')
    .option('-o, --output <output>', 'Specifies the path to the output CSV file', "transformed-generic.csv")
    .option('-d, --debug', 'Abilita la modalità di debug')
    .action((file, options) => {
        execute(file, options, androidToCSV)
    })

program.parse(process.argv)

if (program.args.length === 0) {
    program.help();
}

function execute(file, options, transformer) {
    if (options.debug) {
        debug.enabled = true;
    }
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
