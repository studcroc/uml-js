# umljs

[![npm version](https://img.shields.io/npm/v/@hvg24/umljs.svg)](https://www.npmjs.com/package/@hvg24/umljs)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

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

## Contact Information

If you have any questions, feedback, or encounter issues with this npm package, please feel free to reach out to the package developer:

- [![GitHub](https://img.shields.io/badge/GitHub-%40hvg2416-blue.svg)](https://github.com/hvg2416)

- [![Email](https://img.shields.io/badge/Email-developer.hvg24@gmail.com-blue.svg)](mailto:developer.hvg24@gmail.com)

- [![Medium](https://img.shields.io/badge/Medium-@hvg24-blue.svg)](https://medium.com/@hvg24)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
