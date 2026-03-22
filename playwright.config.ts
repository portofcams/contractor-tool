import { defineConfig } from "@playwright/test";

const isCI = !!process.env.CI;
const baseURL = process.env.BASE_URL || "http://localhost:3000";
const isRemote = baseURL.startsWith("https://");

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL,
    headless: true,
    screenshot: "only-on-failure",
  },
  ...(isRemote
    ? {} // no webServer needed for remote testing
    : {
        webServer: {
          command: "npm run dev",
          port: 3000,
          reuseExistingServer: true,
          timeout: 60000,
        },
      }),
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
