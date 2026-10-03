import type { Metadata } from "next";

// داشبورد نباید در گوگل ایندکس شود
export const metadata: Metadata = { title: "داشبورد", robots: { index: false, follow: false, googleBot: { index: false, follow: false } } };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
