import Image from "next/image";
import Link from "next/link";
import appIcon from "../icon.svg";
import LoginButton from "./login-button";
import SiteMenu from "./site-menu";
import { getVerifiedUser, isAdminUser } from "@/lib/supabase/admin-access";

type HeaderAction = "login" | "signup";

export default async function SiteHeader({
  action = "login",
}: {
  action?: HeaderAction;
}) {
  const user = await getVerifiedUser();
  const headerAction = user ? "logout" : action;
  const emailInitials = Array.from(user?.email ?? "").slice(0, 2).join("");
  const showAdminLink = user ? isAdminUser(user.id) : false;

  return (
    <header className="site-header">
      <nav className="site-header-inner" aria-label="サイトナビゲーション">
        <Link className="brand" href="/" aria-label="next-app ホーム">
          <Image src={appIcon} width={32} height={32} alt="" />
          <span>next-app</span>
        </Link>
        <div className="site-header-actions">
          <LoginButton action={headerAction} />
          <SiteMenu headerAction={headerAction} emailInitials={emailInitials} showAdminLink={showAdminLink} />
        </div>
      </nav>
    </header>
  );
}
