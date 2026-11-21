import type { Metadata } from "next";
import AuthPage from "../_components/auth/auth-page";

export const metadata: Metadata = {
  title: "ログイン | next-app",
  description: "next-appのログイン画面です。",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ logged_out?: string; confirmation?: string }>;
}) {
  const params = await searchParams;
  const notice = params.confirmation === "failed"
    ? "確認リンクが無効か期限切れです。もう一度お試しください。"
    : params.logged_out === "1"
      ? "ログアウトしました。"
      : undefined;
  return <AuthPage mode="login" notice={notice} />;
}
