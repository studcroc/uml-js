import { createWriteStream } from "fs";
import https from "https";
import pako from "pako";
import { resolve } from "path";
import { isDirectory, isImageFilePath } from "./file_handler.js";

const DEFAULT_OUTPUT_FILE_NAME = "umljs.svg";

function textEncode(str) {
  return new TextEncoder("utf-8").encode(str);
}

async function generateSVG(mermaidUMLText, ouputDirectoryOrFilePath) {
  const compressedData = pako.deflate(textEncode(mermaidUMLText), {
    level: 9,
    to: "string",
  });
  const base64EncodedData = Buffer.from(compressedData)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const urlPath = `mermaid/png/${base64EncodedData}`;
  var url = "https://kroki.io/" + urlPath;

  return new Promise((resolvePromise, reject) => {
    https.get(url, function (response) {
      let fileStream;
      if (isImageFilePath(ouputDirectoryOrFilePath)) {
        fileStream = createWriteStream(resolve(ouputDirectoryOrFilePath));
      } else if (isDirectory(ouputDirectoryOrFilePath)) {
        fileStream = createWriteStream(
          resolve(ouputDirectoryOrFilePath, DEFAULT_OUTPUT_FILE_NAME)
        );
      }else {
        reject();
      }
      response.pipe(fileStream);
      resolvePromise();
    });
  });
}

export default generateSVG;
