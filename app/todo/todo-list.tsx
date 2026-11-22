"use client";

import { type FormEvent, useState, useSyncExternalStore } from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const storageKey = "next-app:todo-list";
const changeEvent = "next-app:todo-list-change";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(storageKey) ?? "[]";
  } catch {
    return null;
  }
}

function getServerSnapshot() {
  return "";
}

function readTasks(snapshot: string | null): Task[] {
  if (!snapshot) return [];

  try {
    const value: unknown = JSON.parse(snapshot);
    if (!Array.isArray(value)) return [];
    return value.filter((task): task is Task =>
      task && typeof task.id === "string" &&
      typeof task.title === "string" && typeof task.completed === "boolean",
    );
  } catch {
    return [];
  }
}

export default function TodoList() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const tasks = readTasks(snapshot);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  function updateTasks(update: (current: Task[]) => Task[]) {
    try {
      const current = readTasks(window.localStorage.getItem(storageKey));
      window.localStorage.setItem(storageKey, JSON.stringify(update(current)));
      window.dispatchEvent(new Event(changeEvent));
      setError("");
      return true;
    } catch {
      setError("タスクを保存できませんでした。ブラウザの保存設定を確認してください。");
      return false;
    }
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const task = { id: crypto.randomUUID(), title: trimmedTitle, completed: false };
    if (updateTasks((current) => [...current, task])) setTitle("");
  }

  return (
    <>
      <form className="auth-form" onSubmit={addTask}>
        <div className="auth-field">
          <label htmlFor="new-task">新しいタスク</label>
          <div className="todo-entry">
            <input
              id="new-task"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={160}
              required
            />
            <button className="auth-submit" type="submit" disabled={!title.trim() || !snapshot}>
              追加
            </button>
          </div>
        </div>
      </form>

      {snapshot === null && <p role="status">このブラウザではタスクの保存を利用できません。</p>}
      {error && <p className="auth-form-message" role="alert">{error}</p>}

      {tasks.length > 0 ? (
        <ul className="todo-items" aria-label="タスク一覧">
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(event) => {
                    const completed = event.target.checked;
                    updateTasks((current) => current.map((item) =>
                      item.id === task.id ? { ...item, completed } : item,
                    ));
                  }}
                />
                <span>{task.title}</span>
              </label>
              <button
                className="todo-delete"
                type="button"
                aria-label={`${task.title}を削除`}
                onClick={() => updateTasks((current) => current.filter((item) => item.id !== task.id))}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      ) : snapshot && <p className="todo-empty">タスクはまだありません。</p>}
    </>
  );
}
