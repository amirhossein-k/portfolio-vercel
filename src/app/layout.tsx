import type { Metadata, Viewport } from "next";
import { Vazirmatn, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-vazir", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = { title: "پورتفولیو", description: "نمونه‌کارها و مهارت‌ها" };
export const viewport: Viewport = { themeColor: "#0e130f", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
