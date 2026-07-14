import { expect, test, type Page } from "@playwright/test";

const analyticsMode = process.env.TEST_ANALYTICS_MODE ?? "default";
const analyticsConfigured = analyticsMode === "configured";
const analyticsInvalid = analyticsMode === "invalid";
const cloudflareBeaconSource =
  "https://static.cloudflareinsights.com/beacon.min.js";
const configuredBeacon = "testbeacon0123456789abcdefghijkl";
const allowedAttribution = {
  utm_source: "linkedin",
  utm_medium: "founder-post",
  utm_campaign: "private-ai-launch",
  utm_content: "assessment-cta",
  utm_term: "agentic-rag",
  referral: "warm-intro",
};
const rejectedAttributionParameters = [
  "email",
  "problem",
  "gclid",
  "customer_secret",
] as const;
const rejectedLandingAttribution = {
  email: "private@example.com",
  problem: "sensitive details",
  gclid: "ad-platform-id",
  customer_secret: "do-not-forward",
};

const stubTally = async (page: Page): Promise<void> => {
  await page.route("https://tally.so/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<p>Qualification form fixture</p>",
    }),
  );
};

const expectStrictAttribution = (destination: URL, context: string): void => {
  for (const [name, value] of Object.entries(allowedAttribution)) {
    expect(destination.searchParams.get(name), `${name} in ${context}`).toBe(
      value,
    );
  }

  for (const rejected of rejectedAttributionParameters) {
    expect(
      destination.searchParams.has(rejected),
      `${rejected} in ${context}`,
    ).toBe(false);
  }
};

test.beforeEach(async ({ page }) => {
  if (analyticsConfigured) {
    await page.route(cloudflareBeaconSource, (route) =>
      route.fulfill({ contentType: "application/javascript", body: "" }),
    );
  }
});

test("Cloudflare Web Analytics loads only in the deliberately configured build", async ({
  page,
}) => {
  await page.goto("./");

  const beacon = page.locator(`script[src="${cloudflareBeaconSource}"]`);

  if (analyticsConfigured) {
    await expect(beacon).toHaveCount(1);
    await expect(beacon).toHaveAttribute("defer", "");
    await expect(beacon).toHaveAttribute(
      "data-cf-beacon",
      JSON.stringify({ token: configuredBeacon }),
    );
  } else {
    await expect(beacon).toHaveCount(0);
  }
});

test("an invalid Cloudflare beacon identifier leaves analytics disabled", async ({
  page,
}) => {
  test.skip(!analyticsInvalid);

  await page.goto("./");

  await expect(
    page.locator(`script[src="${cloudflareBeaconSource}"]`),
  ).toHaveCount(0);
});

test("Privacy accurately describes the analytics processor and measured data", async ({
  page,
}) => {
  await page.goto("./privacy/");

  const analyticsProcessor = page.getByRole("article").filter({
    has: page.getByRole("heading", { name: "Cloudflare Web Analytics" }),
  });

  await expect(analyticsProcessor).toContainText(
    "pageviews, page paths, referring sites, and page-load performance metrics",
  );
  await expect(analyticsProcessor).toContainText(
    "does not use cookies or browser storage",
  );

  if (analyticsConfigured) {
    await expect(analyticsProcessor).toContainText(
      "Cloudflare Web Analytics is active in this build.",
    );
  } else {
    await expect(analyticsProcessor).toContainText(
      "Cloudflare Web Analytics is not active in this build. No analytics beacon is loaded.",
    );
  }
});

test("landing attribution preserves the strict allowlist through the intake boundary", async ({
  page,
}) => {
  await stubTally(page);

  const landingParameters = new URLSearchParams({
    ...allowedAttribution,
    offer: "agentic-workspace",
    ...rejectedLandingAttribution,
  });
  await page.goto(`./?${landingParameters}`);
  await page
    .getByRole("link", { name: "Request a Private AI System Assessment" })
    .click();

  const contactUrl = new URL(page.url());
  expect(contactUrl.searchParams.get("offer")).toBe("enterprise-assessment");

  expectStrictAttribution(contactUrl, "Contact");

  const intakeUrl = new URL(
    await page
      .locator('iframe[title="Verran Labs qualification form"]')
      .evaluate((element) => (element as HTMLIFrameElement).src),
  );
  expect(intakeUrl.searchParams.get("offer")).toBe("enterprise-assessment");

  expectStrictAttribution(intakeUrl, "Tally");
});

test("every homepage intake link preserves only approved landing attribution", async ({
  page,
}) => {
  const landingParameters = new URLSearchParams({
    ...allowedAttribution,
    ...rejectedLandingAttribution,
  });
  await page.goto(`./?${landingParameters}`);

  const intakeLinks = page.locator('a[href*="/contact/"]');
  await expect(intakeLinks).toHaveCount(6);

  const destinations = await intakeLinks.evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).href),
  );

  for (const destination of destinations) {
    const intakeUrl = new URL(destination);
    expectStrictAttribution(intakeUrl, destination);
  }
});

test("approved attribution survives ordinary navigation before intake", async ({
  page,
}) => {
  await stubTally(page);
  const landingParameters = new URLSearchParams({
    ...allowedAttribution,
    offer: "workflow-review",
  });
  await page.goto(`./?${landingParameters}`);

  await page.getByRole("link", { name: "Privacy" }).first().click();
  await expect(page).toHaveURL(/\/privacy\//);
  await page.getByRole("link", { name: "Home" }).first().click();
  await page.getByRole("link", { name: "Assessment", exact: true }).click();
  await page.getByRole("link", { name: "Contact" }).first().click();

  const contactUrl = new URL(page.url());
  expectStrictAttribution(contactUrl, "Contact after ordinary navigation");
  expect(contactUrl.searchParams.get("offer")).toBe("workflow-review");

  const intakeUrl = new URL(
    await page
      .locator('iframe[title="Verran Labs qualification form"]')
      .evaluate((element) => (element as HTMLIFrameElement).src),
  );
  expectStrictAttribution(intakeUrl, "Tally after ordinary navigation");
  expect(intakeUrl.searchParams.get("offer")).toBe("workflow-review");
});

test("direct Contact rejects an unapproved offer value", async ({ page }) => {
  await stubTally(page);
  await page.goto(
    "./contact/?offer=private-details-must-not-cross&utm_source=linkedin",
  );

  const intakeUrl = new URL(
    await page
      .locator('iframe[title="Verran Labs qualification form"]')
      .evaluate((element) => (element as HTMLIFrameElement).src),
  );
  expect(intakeUrl.searchParams.has("offer")).toBe(false);
  expect(intakeUrl.searchParams.get("utm_source")).toBe("linkedin");
});
