import parser from "@babel/parser";
import traverse from "@babel/traverse";
import fs from "fs";
import path from "path";
import jotDown from "./analytics.js";

let classes = [];

function buildMethodNameWithParams(methodName, node) {
  for (let i = 0; i < node.params.length; i++) {
    const param = node.params[i];
    if (i == node.params.length - 1) {
      methodName += `${param.name})`;
    } else {
      methodName += `${param.name}, `;
    }
  }
  if (node.params.length === 0) {
    methodName += ")";
  }
  return methodName;
}

function parseUMLInfo(filePath) {
  const fileContent = fs.readFileSync(path.resolve(filePath), "utf-8");

  let ast;
  try {
    ast = parser.parse(fileContent, {
      sourceType: "module",
    });
  } catch (error) {
    throw new Error(`Error parsing file ${filePath}`);
  }

  traverse.default(ast, {
    enter(path) {
      if (path.node.type === "ClassDeclaration") {
        let classObj = {
          name: path.node.id.name,
        };
        if (
          path.node.superClass &&
          path.node.superClass.name !== "HTMLElement"
        ) {
          classObj = { ...classObj, superClass: path.node.superClass.name };
        }
        let classProperties = {
          private: [],
          public: [],
        };
        let classMethods = {
          private: [],
          protected: [],
          public: [],
        };

        path.node.body.body.forEach((node) => {
          if (node.type === "ClassPrivateProperty") {
            classProperties.private.push(node.key.id.name);
          } else if (
            node.type === "ClassPrivateMethod" &&
            node.kind === "method"
          ) {
            let methodName = `${node.key.id.name}(`;
            methodName = buildMethodNameWithParams(methodName, node);
            classMethods.private.push(methodName);
          } else if (
            node.type === "ClassMethod" &&
            node.kind !== "get" &&
            node.kind !== "set"
          ) {
            if (node.kind === "constructor") {
              node.body.body.forEach((item) => {
                if (
                  item.type === "ExpressionStatement" &&
                  item.expression.type === "AssignmentExpression" &&
                  item.expression.left.type === "MemberExpression" &&
                  item.expression.left.property.type !== "PrivateName"
                ) {
                  if (
                    !classProperties.public.includes(
                      item.expression.left.property.name
                    )
                  ) {
                    classProperties.public.push(
                      item.expression.left.property.name
                    );
                  }
                }
              });
            } else {
              let methodName = `${node.key.name}(`;
              methodName = buildMethodNameWithParams(methodName, node);
              if (node.key.name.startsWith("_")) {
                classMethods.private.push(methodName);
              } else if (node.key.name.startsWith("$")) {
                classMethods.protected.push(methodName);
              } else {
                classMethods.public.push(methodName);
              }
            }
          }
        });
        classObj = {
          ...classObj,
          properties: {
            ...classProperties,
          },
          methods: {
            ...classMethods,
          },
        };

        classes.push(classObj);
      }
    },
  });
}

/**
 * Parses the given files and returns the parsed UML information as array
 * @param {Array<String>} filePaths
 * @returns {Array<>}
 */
function parseFilesForUML(filePaths) {
  // Iterate over files to parse UML info
  filePaths.forEach((filePath) => {
    parseUMLInfo(filePath);
  });

  // Jot down number of ES6 classes parsed
  jotDown({
    name: "number_of_es6_classes_parsed",
    data: {
      no_of_es6_classes: classes.length,
    },
  });

  if (classes.length === 0) {
    throw new Error("No ES6 classes were found.");
  }

  return classes;
}

export default parseFilesForUML;
