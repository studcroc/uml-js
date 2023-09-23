import { createWriteStream } from 'fs';
import https from 'https';
import { resolve } from 'path';
import { isImageFilePath } from './file_handler.js';

async function generateUMLDiagram(mermaidUMLText, ouputFilePath) {
  const expectedOutputFormat = ouputFilePath.substr(
    ouputFilePath.lastIndexOf(".") + 1
  );

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
        "Content-Type": "application/text"
      },
    };

    var req = https.request(options, (response) => {
      if (response.statusCode === 200) {
        let fileStream;
        if (isImageFilePath(ouputFilePath)) {
          fileStream = createWriteStream(resolve(ouputFilePath));
        } else {
          reject(`The output file path ${ouputFilePath} is not valid.`);
        }
        response.pipe(fileStream);
        resolvePromise();
      } else {
        reject();
      }
    });
    req.write(reqData);
    req.end();
  });
}

export default generateUMLDiagram;
