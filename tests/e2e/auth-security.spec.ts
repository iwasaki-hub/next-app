import { expect, test } from "@playwright/test";

// CI runs without project credentials: protected pages must not reveal user data.
test("account page requires authentication", async ({ page }) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "ログイン", exact: true })).toBeVisible();
});

test("invalid email confirmation links are rejected without exposing tokens", async ({
  page,
}) => {
  await page.goto("/auth/confirm?token_hash=invalid&type=email");
  await expect(page).toHaveURL(/\/login\?confirmation=failed$/);
  await expect(page.getByRole("main")).toBeVisible();
});
