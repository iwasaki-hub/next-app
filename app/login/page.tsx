import type { Metadata } from "next";
import AuthPage from "../auth-page";

export const metadata: Metadata = {
  title: "ログイン | next-app",
  description: "next-appのログイン画面（認証機能は準備中です）。",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
