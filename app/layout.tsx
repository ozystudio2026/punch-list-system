import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "室內設計工程驗收系統",
  description: "簡單高效的工程驗收管理系統",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
