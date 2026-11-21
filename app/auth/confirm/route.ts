import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// For the Supabase email template using {{ .TokenHash }}.
// Do not log or forward the one-time token.
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");

  if (isSupabaseConfigured() && tokenHash && type === "email") {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email",
    });
    if (!error) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?confirmation=failed", request.url));
}
