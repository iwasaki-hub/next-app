import "server-only";

import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { isSupabaseConfigured } from "./config";
import { createClient } from "./server";

export const getVerifiedUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return error ? null : user;
});

export function isAdminUser(id: string) {
  return process.env.ADMIN_USER_IDS?.split(",").some((entry) => entry.trim() === id) ?? false;
}

export async function requireAdmin() {
  const user = await getVerifiedUser();
  if (!user) redirect("/login");
  if (!isAdminUser(user.id)) notFound();
}
