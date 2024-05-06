# localcsv
Localization CSV Converter CLI to handle special characters between multiple platforms

## Installation
npm install -g path_to_this_CLI

## Usage
### Commands
csv2ios <file-path> - Transforms a Generic CSV file into an IOS CSV File
csv2android <file-path> - Transforms a Generic CSV file into an Android CSV File
ios2csv <file-path> - Transforms an IOS CSV file into a Generic CSV File
android2csv <file-path> - Transforms an Android CSV file into a Generic CSV File

### Options
-o, --output <output-path>: Specifies the path to the output CSV file
-d, --debug <output-path>: Abilita la modalità di debug

### Examples
csv2ios my_file.csv -o converted_file.csv
