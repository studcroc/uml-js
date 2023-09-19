#! /usr/local/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import figlet from "figlet";
import ora from "ora";
import path from 'path';
import DOSRebel from "./src/DOSRebel.font.js";
import getFilePathList, { isImageFilePath, validateDirectoryPath } from "./src/file_handler.js";
import parseFilesForUML from "./src/parser.js";
import generateSVG from "./src/svg_util.js";
import generateMermaidUMLCode from "./src/uml_generator.js";

async function init() {
  // Greet user
  renderHelloText();

  let args = parseUserProvidedArguments();

  const inputDirectoryPath = args.input;
  const ouputFilePath = args.output;

  let spinner = ora().start("Doing some sanity checks.\n");
  // Sanity checks
  validateDirectoryPath(inputDirectoryPath);
  validateDirectoryPath(ouputFilePath.substring(0, ouputFilePath.lastIndexOf(path.sep)));
  spinner.succeed();

  spinner.start("Retrieving list of all concerned js files.\n");
  // Get list of all the relevant js files to parse
  const filePaths = getFilePathList(inputDirectoryPath);
  spinner.succeed();

  spinner.start("Parsing the retrieved js files to extract UML information.\n");
  // Parse files and get the UML relevant information
  const classes = parseFilesForUML(filePaths);
  if (classes.length === 0) {
    spinner.fail();
    spinner.stop();
    console.log(chalk.redBright("No ES6 classes were found."));
    process.exit(1);
  } else {
    spinner.succeed();
  }

  spinner.start("Generating the UML diagram.\n");
  // Generate Mermaid UML code
  const mermaidUMLCode = generateMermaidUMLCode(classes);
  // Generate UML Diagram in image format (Only SVG and PNG are supported)
  await generateSVG(mermaidUMLCode, ouputFilePath);
  spinner.succeed();
  spinner.stop();

  console.log(
    chalk.cyanBright(
      `\nUML Diagram is generated at location ${ouputFilePath}.\n`
    )
  );
}

function parseUserProvidedArguments() {
  const program = new Command();
  program
    .name("umljs")
    .description(
      "Automatic UML Diagram generator you ever needed for Javascript ES6 styled codebase"
    )
    .version("1.0.0", "-v, --version")
    .requiredOption(
      "-i, --input <type>",
      "Input directory path whose JS files are to be parsed and the UML diagram is to be generated from."
    )
    .requiredOption(
      "-o, --output <type>",
      "Output image file name with file extension (Only .svg and .png are supported)."
    )
    .showHelpAfterError(true);

  program.parse();

  let parsedOpts = program.opts();
  let outputFilePath = parsedOpts.output;

  if (!isImageFilePath(outputFilePath)) {
    program.error(
      chalk.redBright("Only SVG and PNG formats are supported. Please check your output file name.")
    );
  }

  return parsedOpts;
}

function renderHelloText() {
  figlet.parseFont("Standard", DOSRebel);
  console.log(
    figlet.textSync("Welcome to\nUML.JS !", {
      horizontalLayout: "fitted",
      verticalLayout: "controlled smushing",
    })
  );
}

init();
