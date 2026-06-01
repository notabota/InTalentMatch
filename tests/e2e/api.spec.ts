import { test, expect } from "@playwright/test";

test.describe("API health", () => {
  test("GET /api/category returns the seeded categories", async ({ request }) => {
    const res = await request.get("/api/category");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty("id");
    expect(body[0]).toHaveProperty("name");
  });

  test("GET /api/account returns 404 without a session", async ({ request }) => {
    const res = await request.get("/api/account");
    expect(res.status()).toBe(404);
  });

  test("cron endpoint rejects requests without bearer secret", async ({ request }) => {
    const res = await request.post("/api/cron/premium");
    expect(res.status()).toBe(401);
  });
});

test.describe("Authenticated flow", () => {
  test("login → fetch account → logout cycle", async ({ request }) => {
    const login = await request.post("/api/account/login", {
      data: { email: "alice@example.com", password: "password123" },
    });
    expect(login.status()).toBe(200);

    const me = await request.get("/api/account");
    expect(me.status()).toBe(200);
    const body = await me.json();
    expect(body.email).toBe("alice@example.com");

    const logout = await request.post("/api/account/logout");
    expect(logout.status()).toBe(200);

    const after = await request.get("/api/account");
    expect(after.status()).toBe(404);
  });
});
