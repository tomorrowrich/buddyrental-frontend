import { test, expect } from "@playwright/test";

test("Check user session is still valid", async ({ page }) => {
  await page.goto("https://mybuddyrental.netlify.app/app");

  // ตรวจสอบว่า user ยังล็อกอินอยู่
  await page.locator("img[alt='User']").click();
  await expect(page.locator("text=John Doe")).toBeVisible();
});

test("Check session cookies", async ({ page }) => {
  await page.goto("https://mybuddyrental.netlify.app/app");

  // ตรวจสอบ Cookie
  const cookies = await page.context().cookies();
  console.log(cookies); // Debug ดูค่า cookie
  expect(cookies.length).toBeGreaterThan(0);
});
