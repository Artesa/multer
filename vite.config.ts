/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import pkg from "./package.json";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/index.ts"),
      name: "index",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    minify: false,
    // outDir: path.resolve(__dirname, "dist"),
    sourcemap: true,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [...Object.keys(pkg.dependencies), /^node:/].filter(x => {
        const include = ["fs-temp", "append-field", "stream-file-type"];
        return typeof x !== "string" || !include.includes(x)
      } ),
      output: {
        compact: false,
      }
    }
  },
  test: {
    globals: true,
    testTimeout: 60000,
  }
});
