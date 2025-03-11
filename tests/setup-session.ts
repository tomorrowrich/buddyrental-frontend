import { chromium } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://mybuddyrental.netlify.app/login");
  await page.fill("#email", "john.doe@example.com");
  await page.fill("#password", "Password123!");
  await page.click("button:has-text('Login')");
  await page.waitForURL("https://mybuddyrental.netlify.app/app");

  await context.storageState({ path: "auth.json" });
  await browser.close();
}

export default globalSetup;
