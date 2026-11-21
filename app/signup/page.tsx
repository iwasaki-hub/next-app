import type { Metadata } from "next";
import AuthPage from "../_components/auth/auth-page";

export const metadata: Metadata = {
  title: "新規登録 | next-app",
  description: "next-appの新規登録画面です。",
};

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
