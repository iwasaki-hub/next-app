import { expect, test } from "@playwright/test";

test("a task can be added, completed, and deleted across reloads", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "メニュー" }).click();
  await page.getByRole("link", { name: "ToDoリスト" }).click();
  await expect(page).toHaveURL(/\/todo$/);

  const input = page.getByRole("textbox", { name: "新しいタスク" });
  await input.fill("週末の買い物");
  await input.press("Enter");
  const task = page.getByRole("checkbox", { name: "週末の買い物" });
  await expect(task).not.toBeChecked();
  await task.check();
  await page.reload();
  await expect(task).toBeChecked();
  await task.uncheck();
  await expect(task).not.toBeChecked();

  await page.getByRole("button", { name: "週末の買い物を削除" }).click();
  await page.reload();
  await expect(task).toHaveCount(0);
  await expect(page.getByText("タスクはまだありません。")).toBeVisible();
});
