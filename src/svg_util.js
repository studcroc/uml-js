import { readFileSync } from "fs";
import pako from "pako";
import { resolve } from "path";

function textEncode(str) {
  return new TextEncoder("utf-8").encode(str);
}

const source = readFileSync(resolve("./umljs.txt"));
const compressedData = pako.deflate(textEncode(source), {
  level: 9,
  to: "string",
});
const base64EncodedData = Buffer.from(compressedData)
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");

const urlPath = `mermaid/svg/${base64EncodedData}`;
var url = "https://kroki.io/" + urlPath;

console.log(url);
