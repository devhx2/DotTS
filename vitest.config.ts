import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/unit/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@dotts": path.resolve(__dirname, "src/index.ts"),
    },
  },
});
