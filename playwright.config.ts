import { defineConfig } from "@playwright/test";

const previewUrl = "http://127.0.0.1:4321/website/";
const analyticsEnvironmentFragment =
  process.env.TEST_ANALYTICS_MODE === "configured"
    ? " PUBLIC_CLOUDFLARE_ANALYTICS_BEACON=testbeacon0123456789abcdefghijkl"
    : process.env.TEST_ANALYTICS_MODE === "invalid"
      ? " PUBLIC_CLOUDFLARE_ANALYTICS_BEACON=not-a-valid-beacon"
      : "";
const buildCommand =
  process.env.TEST_INDEXING_MODE === "indexed"
    ? `PUBLIC_SITE_ORIGIN=https://verranlabs.com PUBLIC_SITE_INDEXING=enabled PUBLIC_TALLY_FORM_ID=test-form PUBLIC_BOOKING_URL=https://calendar.google.com/calendar/appointments/schedules/test-fit-call PUBLIC_FOUNDER_HEADSHOT_URL=https://assets.example.com/joseph-tabalon-jr.jpg PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/confirmed-founder-profile${analyticsEnvironmentFragment} npm run build`
    : `PUBLIC_SITE_INDEXING=enabled PUBLIC_BOOKING_URL=not-a-url PUBLIC_TALLY_FORM_ID=test-form${analyticsEnvironmentFragment} npm run build`;

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
