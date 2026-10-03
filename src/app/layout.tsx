import type { Metadata, Viewport } from "next";
import { Vazirmatn, JetBrains_Mono } from "next/font/google";
import { HEADLINE, KEYWORDS, NAME_EN, NAME_FA, SITE_URL, siteDescription } from "@/lib/seo";
import "./globals.css";

const vazir = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-vazir", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const defaultTitle = `${NAME_FA} | ${HEADLINE}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: defaultTitle, template: `%s | ${NAME_FA}` },
  description: siteDescription(),
  keywords: KEYWORDS,
  applicationName: NAME_FA,
  authors: [{ name: NAME_FA, url: SITE_URL }],
  creator: NAME_FA,
  publisher: NAME_FA,
  category: "technology",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: NAME_FA,
    title: defaultTitle,
    description: siteDescription(),
    images: [{ url: "/og", width: 1200, height: 630, alt: `${NAME_FA} (${NAME_EN}), ${HEADLINE}` }],
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: siteDescription(), images: ["/og"] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0e130f", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa-IR" dir="rtl" className={`${vazir.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
