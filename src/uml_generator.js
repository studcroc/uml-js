import { writeFileSync } from "fs";
import { resolve } from "path";
import { isDirectory, isTXTFilePath } from "./file_handler.js";

/**
 * Generates the text file with the mermaid code to render the UML diagram.
 * @param {Array<*>} classes - Classes and their relations information
 * @param {String} ouputDirectoryOrFilePath - Output file's path
 */
function generateMermaidUMLFile(classes, ouputDirectoryOrFilePath) {
  let textToWrite = "classDiagram\n";
  let relations = {};
  const DEFAULT_OUTPUT_FILE_NAME = "umljs.txt";

  classes.forEach((classObj) => {
    if (classObj.hasOwnProperty("superClass")) {
      relations[classObj.name] = classObj.superClass;
    }
    textToWrite += `\n\tclass ${classObj.name} {`;
    if (classObj.properties.private.length > 0) {
      classObj.properties.private.forEach((prp) => {
        textToWrite += `\n\t-${prp}`;
      });
    }
    if (classObj.properties.public.length > 0) {
      classObj.properties.public.forEach((prp) => {
        textToWrite += `\n\t+${prp}`;
      });
    }
    if (classObj.methods.private.length > 0) {
      classObj.methods.private.forEach((mthd) => {
        textToWrite += `\n\t-${mthd}`;
      });
    }
    if (classObj.methods.protected.length > 0) {
      classObj.methods.protected.forEach((mthd) => {
        textToWrite += `\n\t#${mthd}`;
      });
    }
    if (classObj.methods.public.length > 0) {
      classObj.methods.public.forEach((mthd) => {
        textToWrite += `\n\t+${mthd}`;
      });
    }
    textToWrite += `\n\t}`;
  });

  for (const key in relations) {
    textToWrite += `\n${key} --|> ${relations[key]}`;
  }

  if (isTXTFilePath(ouputDirectoryOrFilePath)) {
    writeFileSync(resolve(ouputDirectoryOrFilePath), textToWrite);
  } else if (isDirectory(ouputDirectoryOrFilePath)) {
    writeFileSync(
      resolve(ouputDirectoryOrFilePath, DEFAULT_OUTPUT_FILE_NAME),
      textToWrite
    );
  }
}

export default generateMermaidUMLFile;
