import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next App | 開発ガイド",
  description:
    "next-appの開発に使うリンクと、環境のセットアップから機能実装までの手順をまとめました。",
};

// Let the fixed bottom navigation account for the iPhone home-indicator safe area.
export const viewport: Viewport = { viewportFit: "cover" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
