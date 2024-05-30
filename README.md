# localcsv
Localization CSV Converter CLI to handle special characters between multiple platforms

## Installation
npm install -g path_to_this_CLI

## Usage
localcsv <command> <argument> -<options>

## Resource Parsing
This set of commands allow to convert mobile resources in CSV format (only available for Android for now...)

### Configuration file
Create a configuration file named: "localcsv-config.json" in the folder where the command is executed, with the following format:
{
    "translationFiles": [<array of paths to the translation files>],
    "headers": [<array of headers of the CSV file>]
}

Note: The first header must be the header of the keys of the resources.

Example:

{
	"translationFiles": [
    	"../src/main/res/values/strings.xml",
    	"../src/main/res/values-it/strings.xml"
	],
	"headers": ["Key", "English", "Italian"]
}

### Commands
parseAndroidRes - Creates a CSV file from the resources in the configuration file
csv2AndroidRes - Creates Android resource files from a CSV file

### Options
-o, --output <output-path>: Specifies the path to the output CSV file
-d, --debug <output-path>: Abilita la modalità di debug

## CSV Formatting
This set of commands converts the special characters in a CSV file to match the special characters used in the string resources of Android and iOS platforms. It can be used to extract 

### Commands
csv2ios <file-path> - Transforms a Generic CSV file into an IOS CSV File
csv2android <file-path> - Transforms a Generic CSV file into an Android CSV File
ios2csv <file-path> - Transforms an IOS CSV file into a Generic CSV File
android2csv <file-path> - Transforms an Android CSV file into a Generic CSV File

### Options
-o, --output <output-path>: Specifies the path to the output CSV file
-d, --debug <output-path>: Abilita la modalità di debug
-s, --separator <separator>, Carattere di separazione del File CSV
-e, --encoding <encoding>, Standard di Encoding

### Examples
localcsv csv2ios my_file.csv -o converted_file.csv

### Special Characters
The CSV Formatting Commands replaces some of the special charaters used in Platform specific resources to human readable characters. Here's the list of the characters being converted:

- HTML Unicode Characters
- %@, %s -> {s}
- %d -> {d}
- %$1$@, %$1$s -> {1s}, {2s},... (the positional number will be maintained in the conversion)
- <b>text</b> -> **text**
- &#8230; -> ...

All the transformations being made can be found in the transformation.js, further conversions can be easily added from there.
