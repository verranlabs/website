import { expect, test } from "@playwright/test";

const tallyFixture = "<p>Qualification form fixture</p>";
const workflowReviewTallyFixture = `
  <form>
    <label>
      <input type="checkbox" name="workflowReviewPriceAcknowledged" required />
      I acknowledge that the AI Workflow Review is $2,500.
    </label>
  </form>
`;

test("a smaller-team buyer can understand the bounded Workflow Review", async ({
  page,
}) => {
  await page.goto("./");

  const workflowReview = page.getByRole("region", {
    name: "AI Workflow Review",
  });

  await expect(workflowReview).toContainText("$2,500");
  await expect(workflowReview).toContainText("Fixed scope");
  await expect(workflowReview).toContainText("one workflow or AI idea");
  await expect(workflowReview).toContainText("one 60–90 minute working session");
  await expect(workflowReview).toContainText("Feasibility recommendation");
  await expect(workflowReview).toContainText("Architecture recommendation");
  await expect(workflowReview).toContainText("Risk recommendation");
  await expect(workflowReview).toContainText("Next-step recommendation");
  await expect(workflowReview).toContainText("Implementation is not included");
  await expect(workflowReview).toContainText("separate scope");
  await expect(
    workflowReview.getByRole("link", { name: "Request the Workflow Review" }),
  ).toHaveAttribute("href", "/website/contact/?offer=workflow-review");
});

test("the Workflow Review CTA preserves only approved attribution into Tally", async ({
  page,
}) => {
  await page.route("https://tally.so/**", (route) =>
    route.fulfill({ contentType: "text/html", body: tallyFixture }),
  );
  await page.goto(
    "./?utm_source=linkedin&utm_campaign=workflow-review-launch&referral=warm-intro&email=private%40example.com&offer=enterprise-assessment",
  );

  const action = page.getByRole("link", {
    name: "Explore the $2,500 Workflow Review",
  });
  const actionUrl = new URL(
    await action.evaluate((link) => (link as HTMLAnchorElement).href),
  );

  expect(actionUrl.pathname).toBe("/website/contact/");
  expect(actionUrl.searchParams.get("offer")).toBe("workflow-review");
  expect(actionUrl.searchParams.get("utm_source")).toBe("linkedin");
  expect(actionUrl.searchParams.get("utm_campaign")).toBe(
    "workflow-review-launch",
  );
  expect(actionUrl.searchParams.get("referral")).toBe("warm-intro");
  expect(actionUrl.searchParams.has("email")).toBe(false);

  await action.click();

  const frame = page.locator('iframe[title="Verran Labs qualification form"]');
  const tallyUrl = new URL(
    await frame.evaluate((element) => (element as HTMLIFrameElement).src),
  );

  expect(tallyUrl.searchParams.get("offer")).toBe("workflow-review");
  expect(tallyUrl.searchParams.get("utm_source")).toBe("linkedin");
  expect(tallyUrl.searchParams.get("utm_campaign")).toBe(
    "workflow-review-launch",
  );
  expect(tallyUrl.searchParams.get("referral")).toBe("warm-intro");
  expect(tallyUrl.searchParams.has("email")).toBe(false);
});

test("price acknowledgement gates Workflow Review scheduling", async ({ page }) => {
  test.skip(process.env.TEST_INDEXING_MODE !== "indexed");

  await page.route("https://tally.so/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: workflowReviewTallyFixture,
    }),
  );
  await page.goto("./contact/?offer=workflow-review");

  await expect(
    page.getByText(
      "AI Workflow Review buyers must acknowledge the published $2,500 price before receiving qualified scheduling access.",
      { exact: true },
    ),
  ).toBeVisible();

  const tallyFrame = page.frameLocator(
    'iframe[title="Verran Labs qualification form"]',
  );
  await expect(
    tallyFrame.getByLabel(
      "I acknowledge that the AI Workflow Review is $2,500.",
    ),
  ).toHaveAttribute("required", "");

  await page.goto("./contact/qualified/");
  await expect(
    page.getByRole("link", { name: "Schedule the Verran Labs Fit Call" }),
  ).toHaveAttribute(
    "href",
    "https://calendar.google.com/calendar/appointments/schedules/test-fit-call",
  );

  await page.goto("./contact/received/");
  await expect(
    page.getByRole("heading", { name: "Your inquiry is in review." }),
  ).toBeVisible();
  await expect(
    page.getByText(/Inquiries that do not meet the published scheduling requirements/),
  ).toBeVisible();
  await expect(page.locator('a[href*="calendar.google"]')).toHaveCount(0);
});
