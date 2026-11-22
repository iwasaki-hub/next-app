import type { Metadata } from "next";
import Link from "next/link";
import { getVerifiedUser } from "@/lib/supabase/admin-access";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "../_components/site-header";
import TodoList from "./todo-list";
import type { Task } from "./task";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ToDoリスト | next-app",
};

async function loadTasks(userId: string): Promise<Task[] | null> {
  const supabase = await createClient();
  const tasks: Task[] = [];
  const pageSize = 200;
  let total = 1;
  while (tasks.length < total) {
    const { data, error, count } = await supabase.from("todo_tasks")
      .select("id,title,completed", tasks.length === 0 ? { count: "exact" } : undefined).eq("user_id", userId)
      .order("created_at").order("id").range(tasks.length, tasks.length + pageSize - 1);
    if (error) return null;
    if (count !== null) total = count;
    if (data.length === 0) break;
    tasks.push(...data);
  }
  return tasks;
}

export default async function TodoPage() {
  const user = await getVerifiedUser();
  const tasks = user ? await loadTasks(user.id) : null;

  return (
    <>
      <SiteHeader />
      <main className="auth-shell">
        <section className="account-card" aria-labelledby="todo-title">
          <h1 id="todo-title">ToDoリスト</h1>
          {user ? (
            <p>タスクはアカウントに保存されます。</p>
          ) : (
            <>
              <p>タスクはこのブラウザに保存されます。</p>
              {isSupabaseConfigured() && <Link className="account-home" href="/login">端末間で使うにはログイン</Link>}
            </>
          )}
          {user && !tasks ? (
            <p role="alert">アカウントのタスクを読み込めませんでした。ページを再読み込みしてください。</p>
          ) : (
            <TodoList key={user?.id ?? "local"} cloud={user && tasks ? { userId: user.id, tasks } : undefined} />
          )}
        </section>
      </main>
    </>
  );
}
