"use client";

import { BookOpen, CircleUserRound, House, LogIn, Shield, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef } from "react";

export default function SiteMenu({
  headerAction,
  emailInitials,
}: {
  headerAction: "login" | "signup" | "logout";
  emailInitials: string;
}) {
  const pathname = usePathname();
  const menuId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const links = [
    { href: "/", label: "ホーム", icon: House },
    { href: "/#guide-content", label: "開発ガイド", icon: BookOpen },
    { href: "/admin", label: "管理ページ", icon: Shield, prefetch: false },
  ];

  if (headerAction === "logout") {
    links.push({ href: "/account", label: "アカウント", icon: CircleUserRound });
  }
  if (pathname === "/login" || headerAction === "signup") {
    links.push({ href: "/login", label: "ログイン", icon: LogIn });
  }
  if (pathname === "/signup" || headerAction === "login") {
    links.push({ href: "/signup", label: "新規登録", icon: UserPlus });
  }

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
          {links.map(({ href, label, icon: Icon, prefetch }) => (
            <li key={href}>
              <Link
                href={href}
                prefetch={prefetch}
                aria-current={pathname === href ? "page" : undefined}
                onClick={closeMenu}
              >
                <Icon className="site-menu-link-icon" size={18} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
