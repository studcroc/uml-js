import jotDown from "./analytics.js";

/**
 * Generates the text file with the mermaid code to render the UML diagram.
 * @param {Array<*>} classes - Classes and their relations information
 */
function generateMermaidUMLCode(classes) {
  let textToWrite = "classDiagram\n";
  let relations = {};

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

  // Jot down the length of mermaid UML code generated
  jotDown({
    name: "length_of_mermaid_uml_code_generated",
    data: {
      length: textToWrite.length,
    },
  });
  return textToWrite;
}

export default generateMermaidUMLCode;
