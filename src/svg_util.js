import { createWriteStream } from "fs";
import https from "https";
import pako from "pako";
import { resolve } from "path";
import { isImageFilePath } from "./file_handler.js";

function textEncode(str) {
  return new TextEncoder("utf-8").encode(str);
}

async function generateSVG(mermaidUMLText, ouputFilePath) {
  const compressedData = pako.deflate(textEncode(mermaidUMLText), {
    level: 9,
    to: "string",
  });
  const base64EncodedData = Buffer.from(compressedData)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const expectedOutputFormat = ouputFilePath.substr(
    ouputFilePath.lastIndexOf(".") + 1
  );
  const urlPath = `mermaid/${expectedOutputFormat}/${base64EncodedData}`;
  var url = "https://kroki.io/" + urlPath;

  return new Promise((resolvePromise, reject) => {
    https.get(url, function (response) {
      let fileStream;
      if (isImageFilePath(ouputFilePath)) {
        fileStream = createWriteStream(resolve(ouputFilePath));
      } else {
        reject();
      }
      response.pipe(fileStream);
      resolvePromise();
    });
  });
}

export default generateSVG;
