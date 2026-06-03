import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ORIGIN = process.env.ORIGIN ?? "http://localhost:3001";
const OUT_DIR = path.resolve("docs", "screenshots");
const WIDTH = 1280;
const HEIGHT = 900;

async function shoot(page, name, url, opts = {}) {
  await page.goto(`${ORIGIN}${url}`, { waitUntil: "networkidle2", timeout: 20000 });
  if (opts.wait) await new Promise((r) => setTimeout(r, opts.wait));
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: !!opts.fullPage });
  console.log(`  ${name}.png`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    defaultViewport: { width: WIDTH, height: HEIGHT },
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();

    console.log("public pages");
    await shoot(page, "01-landing", "/");
    await shoot(page, "02-login", "/Account/Login");
    await shoot(page, "03-register", "/Account/Register");
    await shoot(page, "04-forgot-password", "/Account/ForgotPassword");

    console.log("login as alice");
    await page.goto(`${ORIGIN}/Account/Login`, { waitUntil: "networkidle2" });
    await page.type('input[name="email"]', "alice@example.com");
    await page.type('input[name="password"]', "password123");
    await page.click('button[type="submit"], form button');
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 20000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));

    console.log("authenticated pages");
    await shoot(page, "05-home", "/home");
    await shoot(page, "06-browse-task", "/browse-task");
    await shoot(page, "07-post", "/post");
    await shoot(page, "08-my-requests", "/my-requests");
    await shoot(page, "09-chat", "/chat");
    await shoot(page, "10-profile", "/profile", { wait: 1500 });
    await shoot(page, "11-your-plan", "/profile/your-plan");
    await shoot(page, "12-add-payment-method", "/add-payment-method");

    console.log("logout, switch to bob (provider)");
    await page.goto(`${ORIGIN}/Account/Login`, { waitUntil: "networkidle2" });
    await page.evaluate(async () => {
      await fetch("/api/account/logout", { method: "POST", credentials: "include" });
    });
    await page.goto(`${ORIGIN}/Account/Login`, { waitUntil: "networkidle2" });
    await page.type('input[name="email"]', "bob@example.com");
    await page.type('input[name="password"]', "password123");
    await page.click('button[type="submit"], form button');
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 20000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));

    await shoot(page, "13-my-tasks-provider", "/my-tasks");
    await shoot(page, "14-profile-provider", "/profile", { wait: 1500 });
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
