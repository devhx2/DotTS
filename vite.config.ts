import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: false,
  build: {
    rollupOptions: {
      input: {
        add: "test/run/add.html",
      },
    },
    outDir: "dist",
  },
  server: {
    open: "/test/run/add.html",
  },
});
