"use client";

import { type FormEvent, useState, useSyncExternalStore, useTransition } from "react";

import { saveTodoChange } from "./actions";
import { importBatchSize, type Task, type TodoChange } from "./task";

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

export default function TodoList({
  cloud,
}: {
  cloud?: { userId: string; tasks: Task[] };
}) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const localTasks = readTasks(snapshot);
  const tasks = cloud?.tasks ?? localTasks;
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();

  function saveCloud(change: TodoChange, onSaved?: () => void) {
    if (!cloud) return;
    setError("");
    setNotice("");
    startTransition(async () => {
      try {
        const message = await saveTodoChange(cloud.userId, change);
        if (message) setError(message);
        else onSaved?.();
      } catch {
        setError("タスクを保存できませんでした。再度お試しください。");
      }
    });
  }

  function importLocalTasks() {
    if (!cloud) return;
    setError("");
    setNotice("");
    startTransition(async () => {
      try {
        const original = window.localStorage.getItem(storageKey);
        const source = readTasks(original);
        if (!source.length) return;

        for (let offset = 0; offset < source.length; offset += importBatchSize) {
          const message = await saveTodoChange(cloud.userId, {
            type: "save",
            tasks: source.slice(offset, offset + importBatchSize),
          });
          if (message) {
            setError(message);
            return;
          }
        }

        if (window.localStorage.getItem(storageKey) === original) {
          window.localStorage.removeItem(storageKey);
          window.dispatchEvent(new Event(changeEvent));
          setNotice("このブラウザのタスクをアカウントに移しました。");
        } else {
          setNotice("タスクを取り込みました。ブラウザのタスクが途中で変更されたため、元の一覧は残っています。");
        }
      } catch {
        setError("取り込みを完了できませんでした。ブラウザのタスクを確認して再度お試しください。");
      }
    });
  }

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
    if (cloud) {
      saveCloud({ type: "save", tasks: [task] }, () => setTitle(""));
    } else if (updateTasks((current) => [...current, task])) {
      setTitle("");
    }
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
              readOnly={pending}
              required
            />
            <button className="auth-submit" type="submit" disabled={pending || !title.trim() || (!cloud && !snapshot)}>
              追加
            </button>
          </div>
        </div>
      </form>

      {!cloud && snapshot === null && <p role="status">このブラウザではタスクの保存を利用できません。</p>}
      {error && <p className="auth-form-message" role="alert">{error}</p>}

      {notice && <p role="status">{notice}</p>}
      {cloud && localTasks.length > 0 && (
        <button className="account-home" type="button" disabled={pending} onClick={importLocalTasks}>
          このブラウザのタスクを取り込む
        </button>
      )}

      {tasks.length > 0 ? (
        <ul className="todo-items" aria-label="タスク一覧">
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  disabled={pending}
                  onChange={(event) => {
                    const completed = event.target.checked;
                    if (cloud) {
                      saveCloud({ type: "toggle", id: task.id, completed });
                      return;
                    }
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
                disabled={pending}
                onClick={() => {
                  if (cloud) saveCloud({ type: "delete", id: task.id });
                  else updateTasks((current) => current.filter((item) => item.id !== task.id));
                }}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      ) : (cloud || snapshot) && <p className="todo-empty">タスクはまだありません。</p>}
    </>
  );
}
