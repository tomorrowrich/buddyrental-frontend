import { test, expect } from "@playwright/test";

test("Logout and check session expired", async ({ page }) => {
  await page.goto("https://mybuddyrental.netlify.app/app");

  // คลิกปุ่ม Logout
  await page.locator("img[alt='User']").click();
  await page.locator("text=Logout").click();

  // ล้างคุกกี้ทั้งหมด
  await page.context().clearCookies();

  // ตรวจสอบว่าคุกกี้ถูกลบจริง
  const remainingCookies = await page.context().cookies();
  console.log("Remaining Cookies:", remainingCookies);
  expect(remainingCookies.length).toBe(0);

  await page.waitForURL("https://mybuddyrental.netlify.app/login");
});
