import { expect, test } from "@playwright/test";

test("login and signup pages can be navigated without losing the home link", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "ログイン", exact: true })).toBeVisible();
  await expect(page.getByRole("note")).toContainText("認証・ユーザー登録は利用できません");

  await page.getByRole("link", { name: "新規登録画面へ" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("heading", { name: "アカウントを作成" })).toBeVisible();

  await page.getByRole("link", { name: "ログイン画面へ" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByRole("link", { name: "ホームへ戻る" }).click();
  await expect(page).toHaveURL("/");
});

test("login form has labeled fields, password visibility, and no fake authentication", async ({
  page,
}) => {
  await page.goto("/login");

  const password = page.getByLabel("パスワード", { exact: true });
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "パスワードを表示する" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "パスワードを隠す" }).click();
  await expect(password).toHaveAttribute("type", "password");

  await page.getByLabel("メールアドレス").fill("demo@example.com");
  await password.fill("not-a-real-secret");
  await page.getByRole("button", { name: "ログイン画面を試す" }).click();
  await expect(page.getByRole("status")).toContainText("ログイン・アカウント作成はできません");
  await expect(page.getByRole("status")).toContainText("入力内容は送信・保存されていません");
  await expect(page).toHaveURL(/\/login$/);
});

test("signup validates matching passwords without registering an account", async ({
  page,
}) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: "アカウントを作成" })).toBeVisible();
  await expect(page.getByText("8文字以上で設定してください。")).toBeVisible();

  await page.getByLabel("メールアドレス").fill("demo@example.com");
  await page.getByLabel("パスワード", { exact: true }).fill("example-password");
  const confirmation = page.getByLabel("パスワード（確認）");
  await confirmation.fill("different-password");
  await page.getByRole("button", { name: "登録画面を試す" }).click();
  await expect(page.getByRole("status")).toContainText("パスワードが一致しません");

  await confirmation.fill("example-password");
  await page.getByRole("button", { name: "登録画面を試す" }).click();
  await expect(page.getByRole("status")).toContainText("アカウント作成はできません");
  await expect(page).toHaveURL(/\/signup$/);
});

test("both auth pages fit an iPhone-sized viewport without sideways scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });

  for (const route of ["/login", "/signup"]) {
    await page.goto(route);
    await expect(page.getByRole("main")).toBeVisible();
    const scrollsSideways = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(scrollsSideways).toBe(false);
  }
});
