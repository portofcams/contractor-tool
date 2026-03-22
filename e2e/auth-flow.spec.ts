import { test, expect } from "@playwright/test";

const TEST_EMAIL = `e2e-${Date.now()}@probuildcalc.com`;
const TEST_PASSWORD = "TestPass123!";
const TEST_COMPANY = "E2E Test Flooring Co";

test.describe("Authentication Flow", () => {
  test("signup creates account via API", async ({ request }) => {
    const response = await request.post("/api/auth/signup", {
      data: {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        companyName: TEST_COMPANY,
        trade: "flooring",
      },
    });
    expect([201, 409].includes(response.status())).toBeTruthy(); // 409 if already exists
  });

  test("login with valid credentials redirects to dashboard", async ({ page }) => {
    // Use pre-existing test account
    await page.goto("/login");
    await page.fill("input[name='email']", "hawaiifloorspecialist@gmail.com");
    await page.fill("input[name='password']", "HawaiiFloors2026!");
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await page.waitForURL(/\/(dashboard|quotes|jobs)/, { timeout: 30000 });
    expect(page.url()).toContain("/dashboard");
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
