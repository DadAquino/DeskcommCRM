import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 20_000 },
  workers: 1,
  use: {
    baseURL: process.env.DEMO_BASE_URL ?? "http://localhost:3100",
    viewport: { width: 1440, height: 1000 },
    launchOptions: { executablePath: process.env.DEMO_CHROMIUM_PATH },
    screenshot: "only-on-failure",
  },
});
