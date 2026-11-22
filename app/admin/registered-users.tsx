import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { isAdminUser, requireAdmin } from "@/lib/supabase/admin-access";
import { getSupabaseConfig } from "@/lib/supabase/config";

const perPage = 20;
const dateFormat = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tokyo",
});

export default async function RegisteredUsers({ page }: { page: number }) {
  await requireAdmin();

  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    return <p>ユーザー一覧を取得するためのサーバー設定が必要です。</p>;
  }

  const { url } = getSupabaseConfig();
  const admin = createSupabaseClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, {
      ...init,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    }) },
  });

  const result = await admin.auth.admin.listUsers({ page, perPage }).catch(() => null);
  if (!result || result.error) {
    return <p>ユーザー一覧を取得できませんでした。時間をおいて再度お試しください。</p>;
  }

  const { data } = result;
  const hasNextPage = Boolean(data.nextPage);

  return (
    <>
      {data.users.length === 0 ? (
        <p>{page === 1 ? "登録ユーザーはまだいません。" : "このページにユーザーはいません。"}</p>
      ) : (
        <ul className="admin-user-list">
          {data.users.map(({ id, email, created_at, user_metadata }) => {
            const isAdmin = isAdminUser(id);
            return (
              <li key={id}>
                <span className="admin-user-role" data-admin={isAdmin}>
                  {isAdmin ? "管理者" : "一般ユーザー"}
                </span>
                {typeof user_metadata?.username === "string" && user_metadata.username.trim() && (
                  <strong>{user_metadata.username}</strong>
                )}
                <span>{email ?? "メールアドレス未設定"}</span>
                <time dateTime={created_at}>登録日 {dateFormat.format(new Date(created_at))}</time>
              </li>
            );
          })}
        </ul>
      )}
      {(page > 1 || hasNextPage) && (
        <nav className="admin-user-pagination" aria-label="登録ユーザー一覧のページ">
          {page > 1 && <Link className="account-home" href={page === 2 ? "/admin" : `/admin?page=${page - 1}`} prefetch={false}>前のページ</Link>}
          <span>{page}ページ目</span>
          {hasNextPage && <Link className="account-home" href={`/admin?page=${page + 1}`} prefetch={false}>次のページ</Link>}
        </nav>
      )}
    </>
  );
}
