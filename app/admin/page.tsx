import type { Metadata } from "next";
import SiteHeader from "../_components/site-header";
import RegisteredUsers from "./registered-users";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "管理ページ | next-app",
  robots: { index: false, follow: false },
};

async function checkSupabaseAuth() {
  if (!isSupabaseConfigured()) {
    return "unconfigured";
  }

  const { url, key } = getSupabaseConfig();
  try {
    const response = await fetch(new URL("/auth/v1/settings", url), {
      headers: { apikey: key },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok ? "connected" : "failed";
  } catch {
    return "failed";
  }
}

const connectionStatus = {
  unconfigured: {
    label: "未設定",
    detail: "この環境に Supabase の URL と公開キーを設定してください。",
  },
  connected: {
    label: "接続済み",
    detail: "Supabase Auth API から正常な応答がありました。",
  },
  failed: {
    label: "接続を確認できません",
    detail: "Supabase Auth API の正常な応答を確認できませんでした。環境変数とプロジェクトの稼働状況を確認してください。",
  },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page: param } = await searchParams;
  const requestedPage = typeof param === "string" && /^\d+$/.test(param) ? Number(param) : 1;
  const page = requestedPage >= 1 && requestedPage <= 2147483647 ? requestedPage : 1;
  const status = await checkSupabaseAuth();
  const { label, detail } = connectionStatus[status];

  return (
    <>
      <SiteHeader />
      <main className="auth-shell">
        <div className="account-card">
          <h1>管理ページ</h1>
          <section className="admin-status" aria-labelledby="supabase-status-title">
            <h2 id="supabase-status-title">Supabase の接続状況</h2>
            <p className="admin-status-label" data-connection={status}>{label}</p>
            <p>{detail}</p>
          </section>
          <section className="admin-status" aria-labelledby="registered-users-title">
            <h2 id="registered-users-title">登録ユーザー一覧</h2>
            <RegisteredUsers page={page} />
          </section>
        </div>
      </main>
    </>
  );
}
