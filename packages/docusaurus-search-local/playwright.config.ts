import { defineConfig } from "@playwright/test";
export default defineConfig({
  webServer: {
    command: "npm run serve -- -- --port 3001",
    cwd: "../..",
    url: "http://localhost:3001/",
    timeout: 180 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  retries: 3,
  use: {
    baseURL: "http://localhost:3001/",
  },
});
