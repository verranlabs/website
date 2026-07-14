import { expect, test } from "@playwright/test";

const approvedTallyFixture = `
  <form>
    <label>
      What are you looking for?
      <select name="offer">
        <option>Custom enterprise assessment or pilot</option>
        <option>$2,500 AI Workflow Review</option>
        <option>$4,500 Private Agentic Workspace Setup</option>
        <option>Not sure yet</option>
      </select>
    </label>
    <label>Work email <input type="email" name="email" /></label>
  </form>
`;

test("an enterprise visitor can understand and request the assessment", async ({
  page,
}) => {
  await page.goto("./");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Turn sensitive internal knowledge into a private AI system your team can trust.",
    }),
  ).toBeVisible();

  const primaryAction = page.getByRole("link", {
    name: "Request a Private AI System Assessment",
  });
  const secondaryAction = page.getByRole("link", {
    name: "Explore the $2,500 Workflow Review",
  });

  await expect(primaryAction).toHaveAttribute(
    "href",
    "/website/contact/?offer=enterprise-assessment",
  );
  await expect(secondaryAction).toHaveAttribute(
    "href",
    "/website/contact/?offer=workflow-review",
  );

  const assessment = page.getByRole("region", {
    name: "Private AI System Assessment",
  });
  await expect(assessment).toContainText("2–4 weeks");
  await expect(assessment).toContainText("Custom scoped");
  await expect(assessment).toContainText("Knowledge-source and workflow map");
  await expect(assessment).toContainText("Evaluation plan");
  await expect(assessment).not.toContainText(/\$\d/);

  await expect(page.getByText(/Joseph Tabalon Jr. leads and participates/)).toBeVisible();
  await expect(page.getByText(/does not claim company clearance or certification/)).toBeVisible();
  await expect(page.getByText(/limited number of focused engagements/)).toBeVisible();
});

test("the shared intake keeps sensitive data and scheduling behind safe boundaries", async ({
  page,
}) => {
  await page.route("https://tally.so/**", (route) =>
    route.fulfill({ contentType: "text/html", body: approvedTallyFixture }),
  );
  await page.goto("./contact/?offer=enterprise-assessment");

  await expect(
    page.getByRole("heading", { level: 1, name: "Start with a bounded fit review." }),
  ).toBeVisible();
  await expect(page.getByText("Custom enterprise assessment or pilot", { exact: true })).toBeVisible();
  await expect(page.getByText("$2,500 AI Workflow Review", { exact: true })).toBeVisible();
  await expect(page.getByText("$4,500 Private Agentic Workspace Setup", { exact: true })).toBeVisible();
  await expect(page.getByText("Not sure yet", { exact: true })).toBeVisible();

  await expect(page.getByText(/Do not submit classified information/)).toBeVisible();
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  await expect(page.locator('iframe[title="Verran Labs qualification form"]')).toHaveAttribute(
    "src",
    /https:\/\/tally\.so\/embed\/test-form.*offer=enterprise-assessment/,
  );
  const tallyFrame = page.frameLocator('iframe[title="Verran Labs qualification form"]');
  await expect(tallyFrame.getByLabel("What are you looking for?")).toHaveCount(1);
  await expect(tallyFrame.locator('select[name="offer"] option')).toHaveCount(4);
  await expect(tallyFrame.locator('input[type="file"]')).toHaveCount(0);
  await expect(page.locator('a[href*="calendar.google"]')).toHaveCount(0);
  await expect(page.getByText(/Qualified prospects may be offered an unlisted 20-minute fit call/)).toBeVisible();
  await expect(page.getByText(/Exploratory and uncertain inquiries receive manual review/)).toBeVisible();
});

test("only the qualified completion route reveals configured scheduling", async ({ page }) => {
  test.skip(process.env.TEST_INDEXING_MODE !== "indexed");

  await page.goto("./contact/qualified/");
  await expect(page.getByRole("heading", { name: "Your fit call is ready to schedule." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Schedule the Verran Labs Fit Call" })).toHaveAttribute(
    "href",
    "https://calendar.google.com/calendar/appointments/schedules/test-fit-call",
  );

  await page.goto("./contact/received/");
  await expect(page.getByRole("heading", { name: "Your inquiry is in review." })).toBeVisible();
  await expect(page.locator('a[href*="calendar.google"]')).toHaveCount(0);
});

test("the privacy route explains processors, allowed fields, and prohibited submissions", async ({
  page,
}) => {
  await page.goto("./privacy/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Privacy starts with collecting less." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tally" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Google Calendar" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cloudflare Web Analytics" })).toBeVisible();
  await expect(page.getByText(/Name, work email, organization and role/)).toBeVisible();
  await expect(
    page.getByText("Do not submit classified information.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/Uploads and attachments are not accepted/)).toBeVisible();
  await expect(page.getByText(/retained only as long as needed/)).toBeVisible();
});

test("the enterprise journey remains usable at a 320 pixel viewport", async ({ page }) => {
  const browserErrors: string[] = [];

  await page.route("https://tally.so/**", (route) =>
    route.fulfill({ contentType: "text/html", body: approvedTallyFixture }),
  );
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  await page.setViewportSize({ width: 320, height: 800 });

  for (const route of ["./", "./contact/", "./privacy/"]) {
    await page.goto(route);
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow, `${route} should not overflow horizontally`).toBe(false);
  }

  await page.goto("./");
  await expect(
    page.getByRole("link", { name: "Request a Private AI System Assessment" }),
  ).toBeVisible();
  expect(browserErrors).toEqual([]);
});
