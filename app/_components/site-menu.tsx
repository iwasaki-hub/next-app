"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";

export default function SiteMenu({
  headerAction,
  emailInitials,
}: {
  headerAction: "login" | "signup" | "logout";
  emailInitials: string;
}) {
  const menuId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const accountLink = {
    login: { href: "/signup", label: "新規登録" },
    signup: { href: "/login", label: "ログイン" },
    logout: { href: "/account", label: "アカウント" },
  }[headerAction];

  function closeMenu() {
    const menu = panel.current;
    if (menu?.matches(":popover-open")) {
      menu.hidePopover();
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", closeMenu, { passive: true });
    return () => window.removeEventListener("scroll", closeMenu);
  }, []);

  return (
    <>
      <button
        className="site-menu-toggle"
        type="button"
        aria-label="メニュー"
        popoverTarget={menuId}
      >
        {emailInitials && (
          <span className="site-menu-icon-open site-menu-initials" aria-hidden="true">
            {emailInitials}
          </span>
        )}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {!emailInitials && (
            <path className="site-menu-icon-open" d="M4 6h16M4 12h16M4 18h16" />
          )}
          <path className="site-menu-icon-close" d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
      <div className="site-menu-panel" id={menuId} popover="auto" ref={panel}>
        <ul>
          <li><Link href="/" onClick={closeMenu}>ホーム</Link></li>
          <li><Link href="/#guide-content" onClick={closeMenu}>開発ガイド</Link></li>
          <li><Link href="/admin" prefetch={false} onClick={closeMenu}>管理ページ</Link></li>
          <li><Link href={accountLink.href} onClick={closeMenu}>{accountLink.label}</Link></li>
        </ul>
      </div>
    </>
  );
}
