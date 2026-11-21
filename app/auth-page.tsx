import Link from "next/link";
import AuthForm from "./auth-form";
import SiteHeader from "./site-header";

type AuthMode = "login" | "signup";

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup";

  return (
    <>
      <SiteHeader action={isSignup ? "login" : "signup"} />
      <div className="auth-shell">
        <main className="auth-main">
          <div className="auth-orb auth-orb-one" aria-hidden="true" />
          <div className="auth-orb auth-orb-two" aria-hidden="true" />

          <div className="auth-intro">
            <p className="auth-kicker">
              <span className="auth-kicker-dot" aria-hidden="true" />
              YOUR CREATIVE SPACE
            </p>
            <h1>
              {isSignup ? (
                <>
                  はじめの一歩を、
                  <span>ここから。</span>
                </>
              ) : (
                <>
                  おかえり
                  <span>なさい。</span>
                </>
              )}
            </h1>
            <p className="auth-intro-text">
              {isSignup
                ? "これからのアイデアを、少しずつ形に。あなたのためのスペースを準備しましょう。"
                : "また一緒に、つくる時間を。いつもの場所で、続きから始めましょう。"}
            </p>
            <div className="auth-decor" aria-hidden="true">
              <span className="auth-decor-orb" />
              <span>MAKE SPACE FOR IDEAS</span>
            </div>
          </div>

          <section className="auth-card" aria-labelledby="auth-form-title">
            <div className="auth-card-top">
              <span className="auth-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" />
                </svg>
              </span>
              <p className="auth-card-eyebrow">
                {isSignup ? "CREATE ACCOUNT" : "WELCOME BACK"}
              </p>
            </div>
            <h2 id="auth-form-title">
              {isSignup ? "アカウントを作成" : "ログイン"}
            </h2>
            <p className="auth-card-lead">
              {isSignup
                ? "新しくはじめるための入力フォームです。"
                : "メールアドレスとパスワードを入力してください。"}
            </p>

            <div className="auth-preview-notice" role="note">
              <span aria-hidden="true">✦</span>
              <span>画面プレビュー：現在、認証・ユーザー登録は利用できません。</span>
            </div>

            <AuthForm mode={mode} />

            <div className="auth-switch">
              {isSignup ? "すでにアカウントをお持ちですか？" : "アカウントをお持ちでない方"}
              <Link href={isSignup ? "/login" : "/signup"}>
                {isSignup ? "ログイン画面へ" : "新規登録画面へ"}
              </Link>
            </div>
          </section>
        </main>
        <footer className="auth-footer">Little steps, big ideas.</footer>
      </div>
    </>
  );
}
