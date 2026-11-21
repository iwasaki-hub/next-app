import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("three guide tabs switch panels without losing their accessible state", async ({
  page,
}) => {
  const links = page.getByRole("tab", { name: "便利なリンク" });
  const workflow = page.getByRole("tab", { name: "開発の流れ" });
  const delivery = page.getByRole("tab", { name: "公開フロー" });

  await expect(page.getByRole("tab")).toHaveCount(3);
  await expect(links).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#guide-panel-links")).toBeVisible();
  await expect(page.locator("#guide-panel-workflow")).toBeHidden();

  await workflow.click();
  await expect(workflow).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#guide-panel-workflow")).toBeVisible();
  await expect(page.locator("#guide-panel-links")).toBeHidden();

  await delivery.click();
  await expect(delivery).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#guide-panel-delivery")).toBeVisible();
  await expect(page.locator("#guide-panel-workflow")).toBeHidden();
});

test("tab keyboard navigation supports arrows, Home, End, and wrapping", async ({
  page,
}) => {
  const links = page.getByRole("tab", { name: "便利なリンク" });
  const workflow = page.getByRole("tab", { name: "開発の流れ" });
  const delivery = page.getByRole("tab", { name: "公開フロー" });

  await links.focus();
  await page.keyboard.press("ArrowRight");
  await expect(workflow).toBeFocused();
  await expect(workflow).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("End");
  await expect(delivery).toBeFocused();
  await expect(delivery).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("Home");
  await expect(links).toBeFocused();
  await expect(links).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("ArrowLeft");
  await expect(delivery).toBeFocused();
  await expect(delivery).toHaveAttribute("aria-selected", "true");
});

test("login button explains the unavailable feature and can be dismissed", async ({
  page,
}) => {
  const login = page.getByRole("button", { name: "ログイン" });
  const notice = page.getByRole("status");

  await expect(login).toHaveAttribute("aria-expanded", "false");
  await expect(notice).toBeHidden();

  await login.click();
  await expect(login).toHaveAttribute("aria-expanded", "true");
  await expect(notice).toContainText("ログイン機能は準備中です");

  await page.getByRole("button", { name: "閉じる" }).click();
  await expect(login).toHaveAttribute("aria-expanded", "false");
  await expect(notice).toBeHidden();
  await expect(login).toBeFocused();

  await login.click();
  await page.getByRole("button", { name: "閉じる" }).focus();
  await page.keyboard.press("Escape");
  await expect(notice).toBeHidden();
  await expect(login).toBeFocused();
});

test("hero link navigates to the guide section", async ({ page }) => {
  await page.getByRole("link", { name: "ガイドを見てみる" }).click();
  await expect(page).toHaveURL(/#guide-content$/);
  await expect(page.locator("#guide-content")).toBeVisible();
});

test("mobile width shows the fixed three-tab bar without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.getByRole("tab")).toHaveCount(3);
  await page.getByRole("tab", { name: "公開フロー" }).click();
  await expect(page.locator("#guide-panel-delivery")).toBeVisible();
  const isOverflowing = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(isOverflowing).toBe(false);
});
