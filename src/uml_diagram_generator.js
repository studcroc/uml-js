import { createWriteStream } from "fs";
import https from "https";
import os from "os";
import { parse, resolve } from "path";
import sharp from "sharp";
import { isImageFilePath, isPNGFilePath } from "./file_handler.js";

async function generateUMLDiagram(mermaidUMLText, outputFilePath) {
  const expectedOutputFormat = parse(outputFilePath).ext.slice(1);

  return new Promise((resolvePromise, reject) => {
    var reqData = JSON.stringify({
      diagram_source: mermaidUMLText,
      diagram_type: "mermaid",
      output_format: expectedOutputFormat,
    });

    var options = {
      hostname: "kroki.io",
      method: "POST",
      headers: {
        "Content-Type": "application/text",
      },
    };

    var req = https.request(options, (response) => {
      if (response.statusCode === 200) {
        let fileStream;
        let tempPath;
        if (isPNGFilePath(outputFilePath)) {
          tempPath = resolve(os.tmpdir(), parse(outputFilePath).base);
        } else if (isImageFilePath(outputFilePath)) {
          tempPath = outputFilePath;
        } else {
          reject(`The output file path ${outputFilePath} is not valid.`);
        }
        fileStream = createWriteStream(tempPath);
        response.pipe(fileStream).on("finish", async () => {
          // If it's a PNG file, apply the white background to it.
          if (isPNGFilePath(outputFilePath)) {
            try {
              await applyWhiteBackgroundToPNG(tempPath, outputFilePath);
            } catch (error) {
              reject(error);
            }
          }
          resolvePromise();
        });
      } else {
        reject(`Network error occured while rendering the UML diagram.`);
      }
    });
    req.write(reqData);
    req.end();
  });
}

async function applyWhiteBackgroundToPNG(inputFilePath, outputFilePath) {
  return new Promise((done, reject) => {
    try {
      sharp(inputFilePath)
        .metadata()
        .then(({ width, height }) => {
          // Create a white background image with the same dimensions as the input image
          sharp({
            create: {
              width: width,
              height: height,
              channels: 4, // 4 channels for RGBA
              background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
            },
          })
            .composite([{ input: inputFilePath }]) // Overlay the input image onto the white background
            .toFile(outputFilePath, (err) => {
              if (err) {
                throw err;
              } else {
                done();
              }
            });
        });
    } catch (error) {
      reject("Error in rendering the UML diagram.");
    }
  });
}

export default generateUMLDiagram;
