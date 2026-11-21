import { expect, test } from "@playwright/test";

test("shared header switches only its right action across auth pages", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "ログイン", exact: true })).toBeVisible();
  await expect(page.getByRole("note")).toContainText("認証・ユーザー登録は利用できません");

  await expect(page.getByRole("link", { name: "next-app ホーム" })).toBeVisible();
  await page.getByRole("navigation", { name: "サイトナビゲーション" })
    .getByRole("link", { name: "新規登録" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("heading", { name: "アカウントを作成" })).toBeVisible();

  await page.getByRole("navigation", { name: "サイトナビゲーション" })
    .getByRole("link", { name: "ログイン" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByRole("link", { name: "next-app ホーム" }).click();
  await expect(page).toHaveURL("/");
});


test("home and auth pages share the same navigation appearance at desktop and mobile widths", async ({
  page,
}) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 812 });
    let homeStyle: Record<string, string | number> | undefined;

    for (const [route, actionLabel] of [
      ["/", "ログイン"],
      ["/login", "新規登録"],
      ["/signup", "ログイン"],
    ]) {
      await page.goto(route);
      const header = page.locator("header.site-header");
      await expect(header).toHaveCount(1);
      const nav = page.getByRole("navigation", { name: "サイトナビゲーション" });
      await expect(nav.locator(".brand")).toBeVisible();
      await expect(nav.locator(".login-button")).toHaveText(actionLabel);

      const style = await header.evaluate((element) => {
        const inner = element.querySelector(".site-header-inner");
        const brand = element.querySelector(".brand span");
        const action = element.querySelector(".login-button");
        if (!inner || !brand || !action) throw new Error("Missing shared header parts");
        const css = getComputedStyle(element);
        return {
          background: css.backgroundColor,
          blur: css.backdropFilter,
          height: Math.round(element.getBoundingClientRect().height),
          innerWidth: Math.round(inner.getBoundingClientRect().width),
          brandFontSize: getComputedStyle(brand).fontSize,
          actionHeight: Math.round(action.getBoundingClientRect().height),
        };
      });

      if (!homeStyle) homeStyle = style;
      expect(style).toEqual(homeStyle);
    }
  }
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
