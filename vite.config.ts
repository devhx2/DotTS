import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "/test/run/texture/",
  build: {
    rollupOptions: {},
    outDir: "dist",
  },
  server: {
    open: "/test/run/base/index.html",
  },
});
