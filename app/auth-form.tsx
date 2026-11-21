"use client";

import { useState, type FormEvent } from "react";

type AuthMode = "login" | "signup";

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const isSignup = mode === "signup";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // This is intentionally a UI-only form. Never transmit or persist credentials.
    const form = new FormData(event.currentTarget);
    if (isSignup && form.get("password") !== form.get("confirmPassword")) {
      setMessage("パスワードが一致しません。もう一度確認してください。");
      return;
    }

    setMessage(
      "現在は画面のプレビューです。ログイン・アカウント作成はできません。入力内容は送信・保存されていません。",
    );
  }

  return (
    <form
      className="auth-form"
      autoComplete="off"
      onSubmit={handleSubmit}
      onChange={() => setMessage("")}
    >
      <div className="auth-field">
        <label htmlFor="auth-email">メールアドレス</label>
        <input
          id="auth-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="off"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="auth-password">パスワード</label>
        <div className="auth-password-wrap">
          <input
            id="auth-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            placeholder={isSignup ? "8文字以上" : "パスワードを入力"}
            minLength={isSignup ? 8 : undefined}
            required
            aria-describedby={isSignup ? "auth-password-hint" : undefined}
          />
          <button
            type="button"
            className="auth-reveal"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示する"}
          >
            {showPassword ? "隠す" : "表示"}
          </button>
        </div>
        {isSignup && (
          <p className="auth-field-hint" id="auth-password-hint">
            8文字以上で設定してください。
          </p>
        )}
      </div>

      {isSignup && (
        <div className="auth-field">
          <label htmlFor="auth-confirm-password">パスワード（確認）</label>
          <input
            id="auth-confirm-password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            placeholder="もう一度入力"
            minLength={8}
            required
          />
        </div>
      )}

      <button className="auth-submit" type="submit">
        <span>{isSignup ? "登録画面を試す" : "ログイン画面を試す"}</span>
        <span aria-hidden="true">→</span>
      </button>

      {message && (
        <p className="auth-form-message" role="status">
          {message}
        </p>
      )}
      <p className="auth-safety-note">
        これは認証機能に接続していない画面デモです。実際のパスワードは入力しないでください。
      </p>
    </form>
  );
}
