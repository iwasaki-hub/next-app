"use client";

import { useActionState, useState } from "react";
import { updateUsernameAction } from "@/app/auth/actions";
import type { AuthActionState } from "@/lib/auth-state";

export default function UsernameForm({ initialUsername }: { initialUsername: string }) {
  const [username, setUsername] = useState(initialUsername);
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(updateUsernameAction, {
    status: "idle",
    message: "",
  });

  return (
    <form action={formAction} className="auth-form">
      <div className="auth-field">
        <label htmlFor="account-username">ユーザー名</label>
        <input
          id="account-username"
          name="username"
          type="text"
          autoComplete="nickname"
          required
          maxLength={40}
          value={username}
          readOnly={pending}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <button className="auth-submit" type="submit" disabled={pending}>
        {pending ? "保存中…" : "ユーザー名を保存"}
      </button>
      {state.message && <p className="auth-form-message" role="status">{state.message}</p>}
    </form>
  );
}
