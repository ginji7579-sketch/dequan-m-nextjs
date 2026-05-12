import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO 與社群分享設定（請換成你自己的品牌名稱與圖片）
export const metadata: Metadata = {
  title: "我的網站",
  description: "一個有 Google 登入的網站",
  keywords: ["關鍵字1", "關鍵字2"],
  openGraph: {
    title: "我的網站",
    description: "一個有 Google 登入的網站",
    url: "https://你的網域", // 部署後改為實際網址
    siteName: "我的網站",
    images: [
      {
        url: "https://你的網域/og-image.jpg", // 建議 1200x630
        width: 1200,
        height: 630,
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}