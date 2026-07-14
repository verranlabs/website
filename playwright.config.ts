import { defineConfig } from "@playwright/test";

const previewUrl = "http://127.0.0.1:4321/website/";
const buildCommand =
  process.env.TEST_INDEXING_MODE === "indexed"
    ? "PUBLIC_SITE_ORIGIN=https://verranlabs.com PUBLIC_SITE_INDEXING=enabled npm run build"
    : "PUBLIC_SITE_INDEXING=enabled PUBLIC_BOOKING_URL=not-a-url npm run build";

export default defineConfig({
  testDir: "./tests/acceptance",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: previewUrl,
    trace: "on-first-retry",
  },
  webServer: {
    command: `${buildCommand} && npm run preview -- --host 127.0.0.1 --port 4321`,
    url: previewUrl,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
