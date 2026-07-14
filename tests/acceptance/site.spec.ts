import { expect, test } from "@playwright/test";

const indexingMode = process.env.TEST_INDEXING_MODE ?? "preview";

test("an incomplete preview stays usable and non-indexable", async ({
  page,
}) => {
  test.skip(indexingMode !== "preview");

  await page.goto("./");

  await expect(page).toHaveTitle(/Verran Labs/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://verranlabs.github.io/website/",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://verranlabs.github.io/website/",
  );
});

test("explicit production configuration enables indexing at the canonical origin", async ({
  page,
}) => {
  test.skip(indexingMode !== "indexed");

  await page.goto("./");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index, follow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://verranlabs.com/",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://verranlabs.com/",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://verranlabs.com/assets/social-preview-1200x630.jpg",
  );
});

test("the published route and its navigation have no broken internal links or browser errors", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  const failedResponses: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("response", (response) => {
    if (
      new URL(response.url()).origin === "http://127.0.0.1:4321" &&
      response.status() >= 400
    ) {
      failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  const response = await page.goto("./");

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }),
  ).toBeVisible();

  const hrefs = await page.locator("a[href]").evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")).filter(Boolean),
  );

  for (const href of new Set(hrefs)) {
    if (!href || href.startsWith("mailto:")) {
      continue;
    }

    const target = new URL(href, page.url());

    if (target.origin !== new URL(page.url()).origin) {
      continue;
    }

    if (target.hash && target.pathname === new URL(page.url()).pathname) {
      await expect(page.locator(`[id="${target.hash.slice(1)}"]`)).toHaveCount(1);
      continue;
    }

    const linkedResponse = await page.request.get(target.toString());
    expect(linkedResponse.ok(), `Expected ${target} to resolve`).toBe(true);
  }

  expect(failedResponses).toEqual([]);
  expect(browserErrors).toEqual([]);
});
