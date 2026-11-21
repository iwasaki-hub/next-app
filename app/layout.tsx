import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next App | 開発ガイド",
  description:
    "next-appの開発に使うリンクと、環境のセットアップから機能実装までの手順をまとめました。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
