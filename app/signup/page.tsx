import type { Metadata } from "next";
import AuthPage from "../auth-page";

export const metadata: Metadata = {
  title: "新規登録 | next-app",
  description: "next-appの新規登録画面（アカウント作成機能は準備中です）。",
};

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
