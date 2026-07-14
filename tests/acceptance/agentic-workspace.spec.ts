import { expect, test } from "@playwright/test";

const indexingMode = process.env.TEST_INDEXING_MODE ?? "preview";

const workspaceTallyFixture = `
  <form target="_top">
    <label>
      What are you looking for?
      <select name="offer">
        <option>Custom enterprise assessment or pilot</option>
        <option>$2,500 AI Workflow Review</option>
        <option>$4,500 Private Agentic Workspace Setup</option>
        <option>Not sure yet</option>
      </select>
    </label>
    <label>
      <input type="checkbox" name="workspacePriceAcknowledged" required />
      I acknowledge the published $4,500 fixed price
    </label>
    <button
      type="submit"
      formmethod="get"
      formaction="http://127.0.0.1:4321/website/contact/qualified/"
    >Complete qualified workspace intake</button>
    <button
      type="submit"
      formmethod="get"
      formnovalidate
      formaction="http://127.0.0.1:4321/website/contact/received/"
    >Complete manual-review workspace intake</button>
  </form>
`;

test("an individual knowledge worker can evaluate the fixed-price workspace", async ({
  page,
}) => {
  const response = await page.goto("./private-agentic-workspace/");

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Build a private AI workspace around the knowledge work only you can do.",
    }),
  ).toBeVisible();

  const offer = page.getByRole("region", {
    name: "Private Agentic Workspace Setup",
  });

  await expect(offer).toContainText("$4,500");
  await expect(offer).toContainText("Fixed price");
  await expect(offer).toContainText(/technical founders/i);
  await expect(offer).toContainText(/independent consultants/i);
  await expect(offer).toContainText(/researchers/i);
  await expect(offer).toContainText(/executives/i);
  await expect(offer).toContainText("Up to two approved knowledge sources");
  await expect(offer).toContainText("One bounded workflow");
  await expect(offer).toContainText("Private retrieval and interaction interface");
  await expect(offer).toContainText("Model and hosting guidance");
  await expect(offer).toContainText("Two working sessions");
  await expect(offer).toContainText("Documentation and handoff");
  await expect(offer).toContainText("14 days of support");

  const exclusions = page.getByRole("region", { name: "Outside the base scope" });

  await expect(exclusions).toContainText(/additional knowledge sources/i);
  await expect(exclusions).toContainText(/additional workflows/i);
  await expect(exclusions).toContainText(/third-party integrations/i);
  await expect(exclusions).toContainText(/travel/i);
  await expect(exclusions).toContainText(/ongoing support/i);
  await expect(exclusions).toContainText(/universal personal assistant/i);
});

test("home and navigation expose a lower-priority path to the individual offer", async ({
  page,
}) => {
  await page.goto("./?utm_source=linkedin&referral=warm-intro");

  const enterprisePromise = page.getByRole("heading", {
    level: 1,
    name: "Turn sensitive internal knowledge into a private AI system your team can trust.",
  });
  const individualOffer = page.getByRole("region", {
    name: "Private Agentic Workspace",
  });

  await expect(enterprisePromise).toBeVisible();
  await expect(individualOffer).toContainText("$4,500");
  await expect(individualOffer).toContainText(/technical founders/i);
  const exploreWorkspace = individualOffer.getByRole("link", {
    name: "Explore the Private Agentic Workspace",
  });
  await expect(exploreWorkspace).toHaveAttribute(
    "href",
    /\/website\/private-agentic-workspace\/\?utm_source=linkedin&referral=warm-intro/,
  );

  const offerFollowsHero = await enterprisePromise.evaluate(
    (heading, offer) =>
      Boolean(
        heading.compareDocumentPosition(offer as Node) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    await individualOffer.elementHandle(),
  );
  expect(offerFollowsHero).toBe(true);

  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(navigation.getByRole("link", { name: "Workspace" })).toHaveAttribute(
    "href",
    /\/website\/private-agentic-workspace\/\?utm_source=linkedin&referral=warm-intro/,
  );

  await exploreWorkspace.click();
  await expect(page).toHaveURL(/\/private-agentic-workspace\/\?utm_source=linkedin/);
  await expect(page).toHaveURL(/referral=warm-intro/);
});

test("the workspace CTA preserves approved attribution and reaches preselected intake", async ({
  page,
}) => {
  await page.route("https://tally.so/**", (route) =>
    route.fulfill({ contentType: "text/html", body: workspaceTallyFixture }),
  );
  await page.goto(
    "./private-agentic-workspace/?utm_source=linkedin&utm_campaign=founder-outreach&referral=warm-intro&customer_secret=do-not-forward",
  );

  const requestWorkspace = page.getByRole("link", {
    name: "Request the $4,500 Workspace",
  }).first();
  await expect(requestWorkspace).toHaveAttribute(
    "href",
    /\/website\/contact\/\?offer=agentic-workspace/,
  );
  await requestWorkspace.click();

  await expect(page).toHaveURL(/offer=agentic-workspace/);
  await expect(page).toHaveURL(/utm_source=linkedin/);
  await expect(page).toHaveURL(/utm_campaign=founder-outreach/);
  await expect(page).toHaveURL(/referral=warm-intro/);
  await expect(page).not.toHaveURL(/customer_secret/);

  const frame = page.locator('iframe[title="Verran Labs qualification form"]');
  await expect(frame).toHaveAttribute("src", /offer=agentic-workspace/);
  await expect(frame).toHaveAttribute("src", /utm_source=linkedin/);
  await expect(frame).toHaveAttribute("src", /utm_campaign=founder-outreach/);
  await expect(frame).toHaveAttribute("src", /referral=warm-intro/);
  await expect(frame).not.toHaveAttribute("src", /customer_secret/);

  const tallyFrame = page.frameLocator(
    'iframe[title="Verran Labs qualification form"]',
  );
  await expect(
    tallyFrame.getByLabel("I acknowledge the published $4,500 fixed price"),
  ).toHaveAttribute("required", "");
  await expect(
    page.getByText(/Fixed-price buyers must acknowledge the published price/),
  ).toBeVisible();
  await expect(page.locator('a[href*="calendar.google"]')).toHaveCount(0);
});

test("the offer explains the gated path from qualification to delivery", async ({
  page,
}) => {
  await page.goto("./private-agentic-workspace/");

  const nextSteps = page.getByRole("region", {
    name: "From fit review to workspace handoff",
  });

  await expect(nextSteps).toContainText(/qualification/i);
  await expect(nextSteps).toContainText(/20-minute fit call/i);
  await expect(nextSteps).toContainText(/scope and data boundaries/i);
  await expect(nextSteps).toContainText(/signed agreement/i);
  await expect(nextSteps).toContainText(/invoicing/i);
  await expect(nextSteps).toContainText(/no self-service checkout/i);
  await expect(
    nextSteps.getByRole("link", { name: "Request the $4,500 Workspace" }),
  ).toHaveAttribute(
    "href",
    "/website/contact/?offer=agentic-workspace",
  );
});

test("workspace qualification gates scheduling and preserves manual review", async ({
  page,
}) => {
  test.skip(indexingMode !== "indexed");

  await page.route("https://tally.so/**", (route) =>
    route.fulfill({ contentType: "text/html", body: workspaceTallyFixture }),
  );
  await page.goto("./contact/?offer=agentic-workspace");

  const tallyFrame = page.frameLocator(
    'iframe[title="Verran Labs qualification form"]',
  );
  const qualifiedOutcome = tallyFrame.getByRole("button", {
    name: "Complete qualified workspace intake",
  });

  await qualifiedOutcome.click();
  await expect(page).toHaveURL(/\/contact\/\?offer=agentic-workspace/);

  await tallyFrame
    .getByLabel("I acknowledge the published $4,500 fixed price")
    .check();
  await qualifiedOutcome.click();
  await expect(page).toHaveURL(/\/contact\/qualified\//);
  await expect(
    page.getByRole("link", { name: "Schedule the Verran Labs Fit Call" }),
  ).toHaveAttribute(
    "href",
    "https://calendar.google.com/calendar/appointments/schedules/test-fit-call",
  );

  await page.goto("./contact/?offer=agentic-workspace");
  await tallyFrame
    .getByRole("button", { name: "Complete manual-review workspace intake" })
    .click();
  await expect(page).toHaveURL(/\/contact\/received\//);
  await expect(page.getByRole("heading", { name: "Your inquiry is in review." })).toBeVisible();
  await expect(page.locator('a[href*="calendar.google"]')).toHaveCount(0);
});

test("the workspace remains usable at 320 pixels and follows the launch gate", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("./private-agentic-workspace/");

  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Request the $4,500 Workspace" }).first(),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    indexingMode === "indexed" ? "index, follow" : "noindex, nofollow",
  );

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
