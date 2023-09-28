#! /usr/local/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import figlet from "figlet";
import ora from "ora";
import os from "os";
import path from "path";
import packageJSON from "./package.json" assert { type: "json" };
import DOSRebel from "./src/DOSRebel.font.js";
import jotDown from "./src/analytics.js";
import getFilePathList, {
  isImageFilePath,
  validateDirectoryPath,
} from "./src/file_handler.js";
import parseFilesForUML from "./src/parser.js";
import generateMermaidUMLCode from "./src/uml_code_generator.js";
import generateUMLDiagram from "./src/uml_diagram_generator.js";

let spinner;

async function init() {
  try {
    let args = parseUserProvidedArguments();

    const inputDirectoryPath = args.input;
    const outputFilePath = args.output;

    spinner = ora().start("Doing some sanity checks.\n");
    try {
      // Sanity checks
      validateDirectoryPath(inputDirectoryPath);
      validateDirectoryPath(
        outputFilePath.substring(0, outputFilePath.lastIndexOf(path.sep))
      );
      spinner.succeed();
    } catch (error) {
      showError(error);
    }

    // Greet user
    renderHelloText();

    spinner.start("Retrieving list of all concerned js files.\n");
    // Get list of all the relevant js files to parse
    const filePaths = getFilePathList(inputDirectoryPath);
    spinner.succeed();

    spinner.start(
      "Parsing the retrieved js files to extract UML information.\n"
    );
    // Parse files and get the UML relevant information
    let classes = [];
    try {
      classes = parseFilesForUML(filePaths);
      spinner.succeed();
    } catch (error) {
      showError(error);
    }

    spinner.start("Generating the UML diagram.\n");
    // Generate Mermaid UML code
    const mermaidUMLCode = generateMermaidUMLCode(classes);

    try {
      // Generate UML Diagram in image format (Only SVG and PNG are supported)
      await generateUMLDiagram(mermaidUMLCode, outputFilePath);
      spinner.succeed();

      console.log(
        chalk.cyanBright(
          `\nUML Diagram is generated at location ${path.resolve(outputFilePath)}.\n`
        )
      );
    } catch (error) {
      showError(error);
    }

  } catch (error) {
    console.error(error);
    jotDown({
      name: "unhandled_error",
      data: {
        error,
      },
    });
    console.error(`Something went wrong.`);
    process.exit(1);
  }
}

function parseUserProvidedArguments() {
  const program = new Command();
  program
    .name("umljs")
    .description(
      "Automatic UML Diagram generator you ever needed for Javascript ES6 styled codebase"
    )
    .version(`${packageJSON.version}`, "-v, --version")
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
      chalk.redBright(
        "Only SVG and PNG formats are supported. Please check your output file name."
      )
    );
  }

  return parsedOpts;
}

function renderHelloText() {
  // Get system platform details
  jotDown({
    name: "platform_details",
    data: {
      platform: os.platform(),
      os_type: os.type(),
      os_release: os.release(),
      cpu_arch: os.arch(),
    },
  });

  figlet.parseFont("Standard", DOSRebel);
  console.log(
    figlet.textSync("UML.JS !")
  );
}

function showError(errorMssg) {
  spinner.fail();
  console.error(chalk.redBright(`${errorMssg}`));
  process.exit(1);
}

init();
