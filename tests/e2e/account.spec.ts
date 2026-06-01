import { test, expect } from "@playwright/test";

test.describe("Account flows", () => {
  test("landing page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/InTalentMatch/i);
  });

  test("login page renders form fields", async ({ page }) => {
    await page.goto("/Account/Login");
    await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("register page renders form fields", async ({ page }) => {
    await page.goto("/Account/Register");
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
  });

  test("auth-protected page redirects logged-out user to login", async ({ page }) => {
    await page.goto("/home");
    await page.waitForURL(/\/Account\/Login/);
    await expect(page).toHaveURL(/\/Account\/Login/);
  });
});
