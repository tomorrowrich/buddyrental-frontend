import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    css: true,
    coverage: {
      exclude: [
        "next.config.ts",
        "postcss.config.mjs",
        "tailwind.config.ts",
        "src/setupTests.ts",
        "vitest.config.mts",
        "eslint.config.mjs",
        "**/*.d.ts",
        ".next/**",
        "coverage/**",
      ],
      reporter: ["text", "json", "html"],
      provider: "v8",
      enabled: true,
      clean: true,
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
