"use client";

import { useActionState, useState, type FormEvent } from "react";
import { loginAction, signupAction } from "@/app/auth/actions";

type AuthMode = "login" | "signup";

export default function AuthForm({
  mode,
  configured,
}: {
  mode: AuthMode;
  configured: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [demoMessage, setDemoMessage] = useState("");
  const [state, formAction, pending] = useActionState(
    mode === "signup" ? signupAction : loginAction,
    { status: "idle" as const, message: "" },
  );
  const isSignup = mode === "signup";

  function handleDemoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // No network submission of credentials in the unconfigured preview.
    const form = new FormData(event.currentTarget);
    if (isSignup && form.get("password") !== form.get("confirmPassword")) {
      setDemoMessage("パスワードが一致しません。もう一度確認してください。");
      return;
    }
    setDemoMessage(
      "現在は画面のプレビューです。ログイン・アカウント作成はできません。入力内容は送信・保存されていません。",
    );
  }

  const message = configured ? state.message : demoMessage;

  return (
    <form
      className="auth-form"
      autoComplete={configured ? "on" : "off"}
      action={configured ? formAction : undefined}
      onSubmit={configured ? undefined : handleDemoSubmit}
      onChange={configured ? undefined : () => setDemoMessage("")}
    >
      <div className="auth-field">
        <label htmlFor="auth-email">メールアドレス</label>
        <input
          id="auth-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete={configured ? "email" : "off"}
          placeholder="you@example.com"
          maxLength={254}
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
            autoComplete={configured ? (isSignup ? "new-password" : "current-password") : "off"}
            placeholder={isSignup ? "8文字以上" : "パスワードを入力"}
            minLength={isSignup ? 8 : undefined}
            maxLength={128}
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
            autoComplete={configured ? "new-password" : "off"}
            placeholder="もう一度入力"
            minLength={8}
            maxLength={128}
            required
          />
        </div>
      )}

      <button className="auth-submit" type="submit" disabled={pending}>
        <span>
          {pending
            ? "処理中..."
            : configured
              ? isSignup ? "アカウントを作成" : "ログイン"
              : isSignup ? "登録画面を試す" : "ログイン画面を試す"}
        </span>
        <span aria-hidden="true">→</span>
      </button>

      {message && (
        <p className="auth-form-message" role="status" aria-live="polite">
          {message}
        </p>
      )}
      <p className="auth-safety-note">
        {configured
          ? "認証情報はSupabase Authへ安全に送信されます。パスワードをほかの人に共有しないでください。"
          : "これは認証機能に接続していない画面デモです。実際のパスワードは入力しないでください。"}
      </p>
    </form>
  );
}
