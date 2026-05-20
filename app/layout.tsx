import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OZY Studio Inspection System",
  description: "iPad-optimized construction inspection and defect management system",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OZY Studio Inspection",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
