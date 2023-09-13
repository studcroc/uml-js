import { readdirSync, statSync } from "fs";
import { resolve } from "path";

// Recursive function to get files
function getFiles(dir, files = []) {
  dir = resolve(dir);
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    // Check if the current file/directory is a directory using fs.statSync
    if (statSync(name).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(name, files);
    } else {
      // If it is a file, push the full path to the files array
      if (name.split(".")[name.split(".").length - 1] === "js") {
        files.push(name);
      }
    }
  }
  return files;
}

function getFilePathList(inputDirectoryPath) {
  const files = getFiles(resolve(inputDirectoryPath));
  return files;
}

function validateFilePath(path) {
  let resolvedPath = resolve(path);
  let isValidFile = statSync(resolvedPath).isFile(resolvedPath);

  if (!isValidFile)
    throw Error(`Given path ${path} is not referencing a valid file.`);
}

function validateDirectoryPath(path) {
  let resolvedPath = resolve(path);
  let isValidDirectory = statSync(resolvedPath).isDirectory(resolvedPath);

  if (!isValidDirectory)
    throw Error(`Given path ${path} is not referencing a valid directory.`);
}

function validatePath(path) {
  let resolvedPath = resolve(path);
  let isValidFile = statSync(resolvedPath).isFile(resolvedPath);
  let isValidDirectory = statSync(resolvedPath).isDirectory(resolvedPath);

  if (!isValidDirectory && !isValidFile)
    throw Error(
      `Given path ${path} is not referencing a valid directory or file.`
    );
}

function isTXTFilePath(path) {
  return path.endsWith(".txt");
}

function isImageFilePath(path) {
  return path.endsWith(".png") || path.endsWith(".svg");
}

function isDirectory(path) {
  let resolvedPath = resolve(path);
  return statSync(resolvedPath).isDirectory(resolvedPath);
}

export {
  isDirectory, isImageFilePath as isSVGFilePath, isTXTFilePath,
  validateDirectoryPath,
  validateFilePath,
  validatePath
};
export default getFilePathList;
