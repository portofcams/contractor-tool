import { test, expect } from "@playwright/test";

test.describe("API Routes", () => {
  test("public pages return 200", async ({ request }) => {
    const publicRoutes = ["/landing", "/login", "/signup", "/privacy", "/terms"];
    for (const route of publicRoutes) {
      const response = await request.get(route);
      expect(response.status(), `${route} should return 200`).toBe(200);
    }
  });

  test("auth-required API routes return 401 without session", async ({ request }) => {
    const protectedRoutes = [
      "/api/quotes",
      "/api/customers",
      "/api/jobs",
      "/api/invoices",
      "/api/crew",
      "/api/reviews",
      "/api/templates",
      "/api/price-book",
      "/api/materials/prices",
      "/api/dashboard/stats",
      "/api/usage",
      "/api/search",
      "/api/follow-ups",
      "/api/site-photos",
      "/api/site-notes",
      "/api/floorplans",
      "/api/time-entries",
      "/api/receipts",
    ];
    for (const route of protectedRoutes) {
      const response = await request.get(route);
      expect(
        [401, 307].includes(response.status()),
        `${route} should return 401 or 307 without auth`
      ).toBeTruthy();
    }
  });

  test("signup validates required fields", async ({ request }) => {
    const response = await request.post("/api/auth/signup", {
      data: { email: "test@test.com" }, // missing companyName, password, trade
    });
    expect(response.status()).toBe(400);
  });

  test("contact form accepts valid submission", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "E2E Test",
        email: "e2e@test.com",
        message: "Automated test submission",
      },
    });
    expect(response.status()).toBe(200);
  });

  test("public quote page handles invalid token", async ({ request }) => {
    const response = await request.get("/quote/not-a-real-token");
    expect(response.status()).toBeLessThan(500);
  });

  test("public review page handles invalid token", async ({ request }) => {
    const response = await request.get("/review/not-a-real-token");
    expect(response.status()).toBeLessThan(500);
  });

  test("stripe webhook rejects unsigned requests", async ({ request }) => {
    const response = await request.post("/api/stripe/webhook", {
      data: {},
    });
    expect(response.status()).toBe(400);
  });
});
