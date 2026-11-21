import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// Handles PKCE verification links containing ?code= (default email confirmation).
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (isSupabaseConfigured() && code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?confirmation=failed", request.url));
}
