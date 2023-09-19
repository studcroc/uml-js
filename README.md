# umljs

[![npm version](https://img.shields.io/npm/v/@hvg24/umljs.svg)](https://www.npmjs.com/package/@hvg24/umljs)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Automatic UML Diagram generator for JavaScript ES6 styled codebases.

## Installation

You can easily install `@hvg24/umljs` via npm:

```bash
npm install -g '@hvg24/umljs'
```

## Usage

`umljs` is a command-line tool that allows you to generate UML diagrams from your JavaScript ES6 codebase.

### Options

- `-v, --version`: Output the version number.
- `-i, --input <type>`: Specify the input directory path containing the JavaScript files to be parsed for generating the UML diagram.
- `-o, --output <type>`: Specify the output image file name with the file extension (Supported formats: .svg and .png).
- `-h, --help`: Display help for the command.

### Example

Generate a UML diagram from your JavaScript code:

```bash
umljs -i /path/to/your/codebase -o output.png
```

Replace `/path/to/your/codebase` with the actual path to your JavaScript codebase directory. The UML diagram will be saved as `output.png`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
