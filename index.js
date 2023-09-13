#!/usr/bin/env node

import getFilePathList, { validateDirectoryPath } from "./src/file_handler.js";
import parseFilesForUML from "./src/parser.js";
import generateSVG from "./src/svg_util.js";
import generateMermaidUMLCode from "./src/uml_generator.js";

const inputDirectoryPath = process.argv[2];
const ouputDirectoryOrFilePath = process.argv[3];

async function init() {
  // Sanity checks
  validateDirectoryPath(inputDirectoryPath);

  // Get list of all the relevant js files to parse
  const filePaths = getFilePathList(inputDirectoryPath);

  // Parse files and get the UML relevant information
  const classes = parseFilesForUML(filePaths);

  // Generate Mermaid UML code
  const mermaidUMLCode = generateMermaidUMLCode(
    classes,
    ouputDirectoryOrFilePath
  );

  // Generate UML Diagram in image format (Only SVG and PNG are supported)
  await generateSVG(mermaidUMLCode, ouputDirectoryOrFilePath);
}

init();
