import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Music Theory Lab - コード理論を学ぼう",
  description: "インタラクティブに音楽理論を学べるWebアプリ。コード構成、スケール、ダイアトニックコード、コード進行を視覚と音で理解しよう。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
