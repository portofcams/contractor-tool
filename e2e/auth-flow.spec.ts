import { test, expect } from "@playwright/test";

const TEST_EMAIL = `e2e-${Date.now()}@probuildcalc.com`;
const TEST_PASSWORD = "TestPass123!";
const TEST_COMPANY = "E2E Test Flooring Co";

test.describe("Authentication Flow", () => {
  test("signup creates account and redirects to dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page.fill("input[name='companyName']", TEST_COMPANY);
    await page.fill("input[name='email']", TEST_EMAIL);
    await page.fill("input[name='password']", TEST_PASSWORD);
    // Select trade
    const tradeSelect = page.locator("select[name='trade']");
    if (await tradeSelect.isVisible()) {
      await tradeSelect.selectOption("flooring");
    }
    await page.getByRole("button", { name: /sign up|create|get started/i }).click();
    // Should redirect to login or dashboard
    await page.waitForURL(/\/(dashboard|login)/, { timeout: 15000 });
  });

  test("login with valid credentials redirects to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", TEST_EMAIL);
    await page.fill("input[name='password']", TEST_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("**/dashboard**", { timeout: 15000 });
    await expect(page.url()).toContain("/dashboard");
  });

  test("protected routes redirect when not authenticated", async ({ page }) => {
    const protectedRoutes = [
      "/dashboard",
      "/quotes",
      "/jobs",
      "/customers",
      "/invoices",
      "/time-tracking",
      "/receipts",
      "/settings",
    ];
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForURL("**/login**", { timeout: 5000 });
    }
  });
});
