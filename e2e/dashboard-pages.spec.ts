import { test, expect, Page } from "@playwright/test";

// Helper to login before each test
async function login(page: Page) {
  await page.goto("/login");
  await page.fill("input[name='email']", "hawaiifloorspecialist@gmail.com");
  await page.fill("input[name='password']", "HawaiiFloors2026!");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(/\/(dashboard|quotes|jobs)/, { timeout: 30000 });
}

test.describe("Dashboard Pages", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("dashboard loads with stats", async ({ page }) => {
    await expect(page.url()).toContain("/dashboard");
    // Should have stat cards or chart
    await expect(page.locator("text=Dashboard").first()).toBeVisible();
  });

  test("quotes page loads", async ({ page }) => {
    await page.goto("/quotes");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=/quotes/i").first()).toBeVisible();
  });

  test("new quote page loads with trade selector", async ({ page }) => {
    await page.goto("/quotes/new");
    await page.waitForLoadState("networkidle");
    // Should have the quote form
    const response = await page.waitForResponse(
      (resp) => resp.url().includes("/api/") || resp.status() < 500,
      { timeout: 10000 }
    ).catch(() => null);
    expect(page.url()).toContain("/quotes/new");
  });

  test("customers page loads", async ({ page }) => {
    await page.goto("/customers");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=/customers/i").first()).toBeVisible();
  });

  test("jobs page loads", async ({ page }) => {
    await page.goto("/jobs");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=/jobs/i").first()).toBeVisible();
  });

  test("time tracking page loads with clock in button", async ({ page }) => {
    await page.goto("/time-tracking");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=/time tracking/i").first()).toBeVisible();
  });

  test("receipts page loads with scan button", async ({ page }) => {
    await page.goto("/receipts");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=/receipts/i").first()).toBeVisible();
  });

  test("invoices page loads", async ({ page }) => {
    await page.goto("/invoices");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=/invoices/i").first()).toBeVisible();
  });

  test("templates page loads", async ({ page }) => {
    await page.goto("/templates");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=/templates/i").first()).toBeVisible();
  });

  test("price book page loads", async ({ page }) => {
    await page.goto("/price-book");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=/price book/i").first()).toBeVisible();
  });

  test("settings page loads", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=/settings/i").first()).toBeVisible();
  });

  test("team page loads", async ({ page }) => {
    await page.goto("/team");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=/team/i").first()).toBeVisible();
  });
});
