#!/usr/bin/env node

import getFilePathList, { validateDirectoryPath } from "./src/file_handler.js";
import parseFilesForUML from "./src/parser.js";
import generateMermaidUMLFile from "./src/uml_generator.js";

const inputDirectoryPath = process.argv[2];
const ouputDirectoryOrFilePath = process.argv[3];

// Sanity checks
validateDirectoryPath(inputDirectoryPath);

// Get list of all the relevant js files to parse
const filePaths = getFilePathList(inputDirectoryPath);

// Parse files and get the UML relevant information
const classes = parseFilesForUML(filePaths);

// Generate Mermaid UML code
generateMermaidUMLFile(classes, ouputDirectoryOrFilePath);