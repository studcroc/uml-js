const path = require("path");
const webpack = require('webpack');

module.exports = {
  mode: "production",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "umljs.bundle.js", // Output file name
  },
  target: "node",
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
};
