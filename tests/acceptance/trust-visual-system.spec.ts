import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const indexingMode = process.env.TEST_INDEXING_MODE ?? "preview";
const publicRoutes = [
  {
    path: "./",
    heading: "Turn sensitive internal knowledge into a private AI system your team can trust.",
    assertContent: async (page: Page) => {
      await expect(
        page.getByRole("link", { name: "Request a Private AI System Assessment" }),
      ).toBeVisible();
      await expect(page.getByText("$2,500", { exact: true }).first()).toBeVisible();
      await expect(page.getByText("$4,500 fixed price", { exact: true }).first()).toBeVisible();
      await expect(page.getByRole("region", { name: "Founder-led delivery" })).toBeVisible();
      await expect(
        page.getByRole("figure", { name: "Private AI system architecture" }),
      ).toBeVisible();
    },
    focusAction: (page: Page) =>
      page.getByRole("link", { name: "Request a Private AI System Assessment" }),
  },
  {
    path: "./private-agentic-workspace/",
    heading: "Build a private AI workspace around the knowledge work only you can do.",
    assertContent: async (page: Page) => {
      await expect(page.getByText("$4,500", { exact: true }).first()).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Request the $4,500 Workspace" }).first(),
      ).toBeVisible();
    },
    focusAction: (page: Page) =>
      page.getByRole("link", { name: "Request the $4,500 Workspace" }).first(),
  },
  {
    path: "./contact/",
    heading: "Start with a bounded fit review.",
    assertContent: async (page: Page) => {
      await expect(page.locator(".intake-frame")).toBeVisible();
      await expect(page.getByText("$2,500 AI Workflow Review", { exact: true })).toBeVisible();
      await expect(
        page.getByText("$4,500 Private Agentic Workspace Setup", { exact: true }),
      ).toBeVisible();
    },
    focusAction: (page: Page) =>
      page.getByRole("contentinfo").getByRole("link", { name: "Privacy" }),
  },
  {
    path: "./privacy/",
    heading: "Privacy starts with collecting less.",
    assertContent: async () => undefined,
    focusAction: (page: Page) =>
      page.getByRole("contentinfo").getByRole("link", { name: "Home" }),
  },
] as const;

const tabTo = async (page: Page, target: Locator): Promise<void> => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await page.keyboard.press("Tab");

    if (await target.evaluate((element) => element === document.activeElement)) {
      return;
    }
  }

  throw new Error(`Could not reach ${await target.getAttribute("href")} by keyboard`);
};

const expectVisibleFocus = async (target: Locator): Promise<void> => {
  await expect(target).toBeFocused();
  const focusStyle = await target.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  expect(focusStyle.outlineStyle).not.toBe("none");
  expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThanOrEqual(2);
};

test("founder trust and selected experience stay honest when launch inputs are absent", async ({
  page,
}) => {
  test.skip(indexingMode !== "preview");

  await page.goto("./");

  const founder = page.getByRole("region", { name: "Founder-led delivery" });
  await expect(founder).toContainText(
    "Joseph Tabalon Jr. leads and participates directly in every engagement",
  );
  await expect(founder.getByRole("img")).toHaveCount(0);
  await expect(founder.getByRole("link", { name: /LinkedIn/i })).toHaveCount(0);
  await expect(founder).toContainText(
    "Professional headshot and LinkedIn profile pending launch verification.",
  );

  const experience = page.getByRole("region", { name: "Selected Experience" });
  await expect(experience).toContainText("DoD cyber RAG and NLP");
  await expect(experience).toContainText("Secure container and AWS deployment");
  await expect(experience).toContainText("Production data ingestion and evaluation");
  await expect(experience).toContainText("Computer-vision inspection and imaging");
  await expect(experience).toContainText(
    "Anonymized areas from Joseph’s prior work—not Verran Labs client case studies.",
  );
});

test("confirmed founder inputs render without changing the trust claims", async ({
  page,
}) => {
  test.skip(indexingMode !== "indexed");

  await page.route("https://assets.example.com/joseph-tabalon-jr.jpg", (route) =>
    route.fulfill({
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" />',
      contentType: "image/svg+xml",
    }),
  );
  await page.goto("./");

  const founder = page.getByRole("region", { name: "Founder-led delivery" });
  await expect(
    founder.getByRole("img", { name: "Joseph Tabalon Jr., founder of Verran Labs" }),
  ).toHaveAttribute(
    "src",
    "https://assets.example.com/joseph-tabalon-jr.jpg",
  );
  await expect(founder.getByRole("link", { name: "View Joseph on LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/confirmed-founder-profile",
  );
  await expect(founder).not.toContainText("pending launch verification");
  await expect(founder).toContainText(
    "Joseph Tabalon Jr. leads and participates directly in every engagement",
  );
});

test("the architecture visual communicates system and human-control boundaries", async ({
  page,
}) => {
  await page.goto("./");

  const architecture = page.getByRole("figure", {
    name: "Private AI system architecture",
  });
  await expect(architecture).toContainText("Approved sources");
  await expect(architecture).toContainText("Controlled ingestion");
  await expect(architecture).toContainText("Retrieval");
  await expect(architecture).toContainText("Model boundary");
  await expect(architecture).toContainText("Bounded actions");
  await expect(architecture).toContainText("Human approval");
  await expect(architecture).toContainText("Evaluation feedback");
  await expect(architecture.getByRole("img")).toHaveCount(0);
});

test("keyboard visitors can see focus and skip directly to the main content", async ({
  page,
}) => {
  await page.goto("./");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveAttribute("href", "#main-content");

  await expectVisibleFocus(skipLink);

  await page.keyboard.press("Enter");
  await expect(page.locator("main#main-content")).toBeFocused();
});

test("all four routes keep semantic structure, contrast, and width from 320 pixels upward", async ({
  page,
}) => {
  await page.route("https://tally.so/**", (route) =>
    route.fulfill({
      body: '<form><label>Work email <input type="email" name="email" /></label></form>',
      contentType: "text/html",
    }),
  );

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);

    for (const route of publicRoutes) {
      await page.goto(route.path);
      await expect(page.locator("main#main-content")).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1, name: route.heading })).toHaveCount(1);
      await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();

      await route.assertContent(page);

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasHorizontalOverflow, `${route.path} at ${viewport.width}px`).toBe(false);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        results.violations,
        `${route.path} at ${viewport.width}px: ${results.violations
          .map((violation) => `${violation.id} (${violation.nodes.length})`)
          .join(", ")}`,
      ).toEqual([]);
    }
  }
});

test("navigation, calls to action, and footer links expose visible keyboard focus", async ({
  page,
}) => {
  for (const route of publicRoutes) {
    await page.goto(route.path);

    const contactNavigationLink = page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Contact" });
    await tabTo(page, contactNavigationLink);
    await expectVisibleFocus(contactNavigationLink);

    const pageAction = route.focusAction(page);

    await tabTo(page, pageAction);
    await expectVisibleFocus(pageAction);
  }

  if (indexingMode === "indexed") {
    await page.goto("./");
    const linkedIn = page.getByRole("link", { name: "View Joseph on LinkedIn" });
    await tabTo(page, linkedIn);
    await expectVisibleFocus(linkedIn);
  }
});

test("public proof distinguishes prior experience, planned demonstrations, and company claims", async ({
  page,
}) => {
  await page.goto("./");

  const experience = page.getByRole("region", { name: "Selected Experience" });
  await expect(experience).toContainText(
    "Planned demonstrations are not presented as completed work.",
  );
  await expect(experience).toContainText("No client identities");
  await expect(experience).toContainText("invented metrics");

  const founder = page.getByRole("region", { name: "Founder-led delivery" });
  await expect(founder).toContainText(
    "Verran Labs does not claim company clearance or certification",
  );
  await expect(founder).toContainText(
    "does not promise that any deployment pattern is automatically secure or compliant",
  );
});

test("reduced-motion preferences suppress decorative motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");

  const motion = await page
    .getByRole("link", { name: "Request a Private AI System Assessment" })
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        animationDuration: Number.parseFloat(style.animationDuration) || 0,
        transitionDuration: Number.parseFloat(style.transitionDuration) || 0,
      };
    });

  expect(motion.animationDuration).toBeLessThanOrEqual(0.001);
  expect(motion.transitionDuration).toBeLessThanOrEqual(0.001);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    "auto",
  );
});

test("core navigation and content work without client-side JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:4321/website/",
    javaScriptEnabled: false,
  });
  const page = await context.newPage();

  await page.goto("./");
  await expect(page.getByText("$2,500", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("$4,500 fixed price", { exact: true }).first()).toBeVisible();

  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Workspace" })
    .click();
  await expect(page).toHaveURL(/\/private-agentic-workspace\/$/);
  await expect(page.getByRole("heading", { level: 1, name: publicRoutes[1].heading })).toBeVisible();
  await page.getByRole("link", { name: "Request the $4,500 Workspace" }).first().click();
  await expect(page).toHaveURL(/\/contact\/\?offer=agentic-workspace$/);

  await page.goto("./");
  await page.getByRole("link", { name: "Explore the $2,500 Workflow Review" }).click();
  await expect(page).toHaveURL(/\/contact\/\?offer=workflow-review$/);

  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Privacy" })
    .click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.getByRole("heading", { level: 1, name: publicRoutes[3].heading })).toBeVisible();

  await context.close();
});
