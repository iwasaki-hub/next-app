import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "../_components/site-header";
import UsernameForm from "./username-form";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "マイページ | next-app",
  description: "ログイン中のアカウントを確認します。",
};

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  const username = user.user_metadata.username;

  return (
    <>
      <SiteHeader />
      <main className="auth-shell">
        <section className="account-card" aria-labelledby="account-title">
          <p className="auth-card-eyebrow">YOUR CREATIVE SPACE</p>
          <h1 id="account-title">ログインしました。</h1>
          <p>アカウントのメールアドレス</p>
          <p className="account-email">{user.email ?? "登録メールアドレスなし"}</p>
          <p>ログイン状態はSupabase Authで管理されています。</p>
          <UsernameForm key={user.id} initialUsername={typeof username === "string" ? username : ""} />
          <Link className="account-home" href="/">ホームへ戻る</Link>
        </section>
      </main>
    </>
  );
}
