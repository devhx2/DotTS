import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "/test/run/texture/",
  build: {
    rollupOptions: {},
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@dotts": path.resolve(__dirname, "src/index.ts"),
    },
  },
  server: {
    open: "/test/run/base/index.html",
  },
});
