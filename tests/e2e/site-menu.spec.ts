import { expect, test } from "@playwright/test";

test("header menu works on mobile and closes after navigation or dismissal", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto("/login");

  const toggle = page.getByRole("button", { name: "メニュー" });
  const guide = page.getByRole("link", { name: "開発ガイド" });

  await expect(guide).toBeHidden();
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(guide).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(guide).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await page.getByRole("heading", { name: "ログイン", exact: true }).click();
  await expect(guide).toBeHidden();

  await toggle.click();
  await guide.click();
  await expect(page).toHaveURL(/\/#guide-content$/);
  await expect(guide).toBeHidden();
  await expect(page.locator("#guide-content")).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});
