import type { Metadata } from "next";
import SiteHeader from "../_components/site-header";
import TodoList from "./todo-list";

export const metadata: Metadata = {
  title: "ToDoリスト | next-app",
};

export default function TodoPage() {
  return (
    <>
      <SiteHeader />
      <main className="auth-shell">
        <section className="account-card" aria-labelledby="todo-title">
          <h1 id="todo-title">ToDoリスト</h1>
          <p>タスクはこのブラウザに保存されます。</p>
          <TodoList />
        </section>
      </main>
    </>
  );
}
