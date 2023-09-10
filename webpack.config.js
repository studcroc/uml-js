const path = require("path");

module.exports = {
  mode: "production",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "umljs.bundle.js", // Output file name
  },
  target: 'node',
  resolve: {
    fallback: {
      path: false,
      fs: false,
    },
  },
};
