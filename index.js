const parser = require("@babel/parser");
const fs = require("fs");
const path = require("path");
const traverse = require("@babel/traverse").default;

let classes = [];

function parseUMLInfo(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const ast = parser.parse(fileContent, {
    sourceType: "module",
  });

  traverse(ast, {
    enter(path) {
      if (path.node.type === "ClassDeclaration") {
        let classObj = {
          name: path.node.id.name,
        };
        if (path.node.superClass) {
          classObj = { ...classObj, superClass: path.node.superClass.name };
        }
        let classProperties = {
          private: [],
          public: [],
        };
        let classMethods = {
          private: [],
          public: [],
        };

        path.node.body.body.forEach((node) => {
          if (node.type === "ClassPrivateProperty") {
            classProperties.private.push(node.key.id.name);
          } else if (
            node.type === "ClassPrivateMethod" &&
            node.kind === "method"
          ) {
            classMethods.private.push(node.key.id.name);
          } else if (
            node.type === "ClassMethod" &&
            node.kind !== "constructor" &&
            node.kind !== "get" &&
            node.kind !== "set"
          ) {
            if (node.kind === "method" && node.type === 'ClassMethod') {
              classMethods.public.push(node.key.name);
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

function getListOfAllFilePaths() {
  let files = fs.readdirSync(path.resolve("./sample"));
  files.forEach((file) => {
    parseUMLInfo(path.resolve(`./sample/${file}`));
  });
}

getListOfAllFilePaths();

console.dir(classes, {
  depth: 3,
});
