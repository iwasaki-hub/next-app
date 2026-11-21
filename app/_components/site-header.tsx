import Image from "next/image";
import Link from "next/link";
import appIcon from "../icon.svg";
import LoginButton from "./login-button";
import SiteMenu from "./site-menu";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type HeaderAction = "login" | "signup";

export default async function SiteHeader({
  action = "login",
}: {
  action?: HeaderAction;
}) {
  let signedIn = false;
  let emailInitials = "";
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    signedIn = Boolean(user);
    emailInitials = Array.from(user?.email ?? "").slice(0, 2).join("");
  }

  const headerAction = signedIn ? "logout" : action;

  return (
    <header className="site-header">
      <nav className="site-header-inner" aria-label="サイトナビゲーション">
        <Link className="brand" href="/" aria-label="next-app ホーム">
          <Image src={appIcon} width={32} height={32} alt="" />
          <span>next-app</span>
        </Link>
        <div className="site-header-actions">
          <LoginButton action={headerAction} />
          <SiteMenu headerAction={headerAction} emailInitials={emailInitials} />
        </div>
      </nav>
    </header>
  );
}
