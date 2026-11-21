"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthActionState } from "@/lib/auth-state";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const unavailable = "現在は画面のプレビューです。ログイン・アカウント作成はできません。入力内容は送信・保存されていません。";

function validateCredentials(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) ||
    typeof password !== "string" ||
    password.length < 1 ||
    password.length > 128
  ) {
    return null;
  }

  return { email: email.trim(), password };
}

export async function loginAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { status: "success", message: unavailable };
  }

  const credentials = validateCredentials(formData);
  if (!credentials) {
    return { status: "error", message: "メールアドレスとパスワードを確認してください。" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    // A generic error avoids revealing account registration state.
    return { status: "error", message: "ログインできませんでした。入力内容やメール認証の状態をご確認ください。" };
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signupAction(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { status: "success", message: unavailable };
  }

  const credentials = validateCredentials(formData);
  const confirmPassword = formData.get("confirmPassword");
  if (!credentials || credentials.password.length < 8) {
    return { status: "error", message: "有効なメールアドレスと8文字以上のパスワードを入力してください。" };
  }
  if (confirmPassword !== credentials.password) {
    return { status: "error", message: "パスワードが一致しません。もう一度確認してください。" };
  }

  // The redirect origin must be configured in Supabase Auth's URL allow list.
  const origin = process.env.NEXT_PUBLIC_SITE_URL || (await headers()).get("origin");
  const emailRedirectTo = origin ? new URL("/auth/callback", origin).toString() : undefined;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...credentials,
    options: { emailRedirectTo },
  });

  if (error) {
    const message = error.code === "weak_password"
      ? "パスワードの安全性が不足しています。より強いパスワードを設定してください。"
      : "アカウントを作成できませんでした。入力内容を確認し、時間をおいて再度お試しください。";
    return { status: "error", message };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/account");
  }

  return {
    status: "success",
    message: "登録手続きを受け付けました。メールが届いたら確認リンクを開いてください。すでに登録済みの場合はメールが送られないことがあります。",
  };
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login?logged_out=1");
}
