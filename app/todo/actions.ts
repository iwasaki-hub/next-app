"use server";

import { revalidatePath } from "next/cache";
import { getVerifiedUser } from "@/lib/supabase/admin-access";
import { createClient } from "@/lib/supabase/server";
import { importBatchSize, type TodoChange } from "./task";

const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const saveError = "タスクを保存できませんでした。時間をおいて再度お試しください。";

export async function saveTodoChange(expectedUserId: string, change: TodoChange) {
  const user = await getVerifiedUser();
  if (!user || user.id !== expectedUserId) {
    return "再度ログインしてからお試しください。";
  }

  const supabase = await createClient();
  const tasks = supabase.from("todo_tasks");

  switch (change?.type) {
    case "save": {
      if (!Array.isArray(change.tasks) || !change.tasks.length ||
        change.tasks.length > importBatchSize || change.tasks.some((task) =>
          !task || typeof task.id !== "string" || !uuid.test(task.id) ||
          typeof task.title !== "string" || !task.title.trim() ||
          task.title.trim().length > 160 || typeof task.completed !== "boolean"
        )) {
        return "タスクの内容を確認してください。";
      }

      const { error } = await tasks.upsert(
        change.tasks.map(({ id, title, completed }) => ({
          id, title: title.trim(), completed, user_id: user.id,
        })),
        { onConflict: "user_id,id", ignoreDuplicates: true },
      );
      if (error) return saveError;
      break;
    }
    case "toggle": {
      if (typeof change.id !== "string" || !uuid.test(change.id) ||
        typeof change.completed !== "boolean") return saveError;

      const { error } = await tasks.update({ completed: change.completed })
        .eq("user_id", user.id).eq("id", change.id);
      if (error) return saveError;
      break;
    }
    case "delete": {
      if (typeof change.id !== "string" || !uuid.test(change.id)) return saveError;

      const { error } = await tasks.delete().eq("user_id", user.id).eq("id", change.id);
      if (error) return saveError;
      break;
    }
    default:
      return saveError;
  }

  revalidatePath("/todo");
  return null;
}
