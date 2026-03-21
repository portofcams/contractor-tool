import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/ContractorCalc/);
    await expect(page.locator("input[name='email']")).toBeVisible();
    await expect(page.locator("input[name='password']")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("signup page loads", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("input[name='companyName']")).toBeVisible();
    await expect(page.locator("input[name='email']")).toBeVisible();
    await expect(page.locator("input[name='password']")).toBeVisible();
  });

  test("login page has Google sign-in button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
  });

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "fake@test.com");
    await page.fill("input[name='password']", "wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 10000 });
  });

  test("unauthenticated user is redirected from dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login**");
    expect(page.url()).toContain("/login");
  });

  test("landing page loads for unauthenticated users", async ({ page }) => {
    await page.goto("/landing");
    await expect(page.getByText(/ContractorCalc/)).toBeVisible();
  });

  test("login page links to signup", async ({ page }) => {
    await page.goto("/login");
    const signupLink = page.getByRole("link", { name: /sign up/i });
    await expect(signupLink).toBeVisible();
  });

  test("public quote page handles invalid token", async ({ page }) => {
    const response = await page.goto("/quote/invalid-token-123");
    // Should load the page (may show 404 or error)
    expect(response?.status()).toBeLessThan(500);
  });
});
