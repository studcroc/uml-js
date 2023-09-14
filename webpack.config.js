import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: "production",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "umljs.bundle.cjs", // Output file name
  },
  target: "node",
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
}; 