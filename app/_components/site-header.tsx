import Image from "next/image";
import Link from "next/link";
import appIcon from "../icon.svg";
import LoginButton from "./login-button";

type HeaderAction = "login" | "signup";

export default function SiteHeader({
  action = "login",
}: {
  action?: HeaderAction;
}) {
  return (
    <header className="site-header">
      <nav className="site-header-inner" aria-label="サイトナビゲーション">
        <Link className="brand" href="/" aria-label="next-app ホーム">
          <Image src={appIcon} width={32} height={32} alt="" />
          <span>next-app</span>
        </Link>
        <LoginButton action={action} />
      </nav>
    </header>
  );
}
