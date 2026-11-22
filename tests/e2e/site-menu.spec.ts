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
  await page.mouse.click(10, 110);
  await expect(guide).toBeHidden();

  await toggle.click();
  await guide.click();
  await expect(page).toHaveURL(/\/#guide-content$/);
  await expect(guide).toBeHidden();
  await expect(page.locator("#guide-content")).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test("the menu hides the admin link from signed-out visitors", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "メニュー" }).click();
  await expect(page.getByRole("link", { name: "開発ガイド" })).toBeVisible();
  await expect(page.locator('.site-menu-panel a[href="/admin"]')).toHaveCount(0);
});

test("home menu switches icons and closes on scroll", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "メニュー" });
  const openIcon = toggle.locator(".site-menu-icon-open");
  const closeIcon = toggle.locator(".site-menu-icon-close");
  const guide = page.getByRole("link", { name: "開発ガイド" });

  await expect(openIcon).toBeVisible();
  await toggle.click();
  await expect(closeIcon).toBeVisible();
  await expect(openIcon).toBeHidden();
  await expect(guide).toBeVisible();

  await toggle.click();
  await expect(guide).toBeHidden();
  await expect(openIcon).toBeVisible();
  await expect(closeIcon).toBeHidden();

  await toggle.click();
  await expect(closeIcon).toBeVisible();
  await page.mouse.move(20, 400);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect(guide).toBeHidden();
  await expect(openIcon).toBeVisible();
  await expect(closeIcon).toBeHidden();
});

for (const route of ["/login", "/signup"]) {
  test(`menu closes on scroll at ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 320 });
    await page.goto(route);

    const toggle = page.getByRole("button", { name: "メニュー" });
    const guide = page.getByRole("link", { name: "開発ガイド" });
    await toggle.click();
    await expect(guide).toBeVisible();
    await expect(toggle.locator(".site-menu-icon-close")).toBeVisible();

    await page.mouse.move(20, 290);
    await page.mouse.wheel(0, 200);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(guide).toBeHidden();
    await expect(toggle.locator(".site-menu-icon-open")).toBeVisible();
  });
}
