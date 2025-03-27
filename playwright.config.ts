import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/*.test.ts"],
  timeout: 30000,
  use: {
    browserName: "chromium",
    headless: true,
    storageState: "auth.json",
  },
  reporter: [["html", { outputFolder: "playwright-report" }]],
  globalSetup: "./tests/setup-session.ts",
});
