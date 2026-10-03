"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#projects", label: "نمونه‌کارها" },
  { href: "/#skills", label: "مهارت‌ها" },
  { href: "/#experience", label: "سوابق" },
  { href: "/#contact", label: "تماس" },
];

export default function Header({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={cn("sticky top-0 z-40 transition", scrolled || open ? "border-b border-line bg-ink/85 backdrop-blur-lg" : "border-b border-transparent")}>
      <div className="wrap flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-[17px] font-bold" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber font-mono text-[15px] text-ink">{"</>"}</span>
          {name}
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full px-4 py-2 text-[15px] text-muted transition hover:text-paper">{n.label}</a>
          ))}
        </nav>
        <button aria-label="منو" className="grid h-11 w-11 place-items-center rounded-full border border-line md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="wrap flex h-[calc(100dvh-4rem)] flex-col gap-1 pb-8 pt-4 md:hidden">
          {NAV.map((n, i) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} style={{ animationDelay: `${i * 60}ms` }}
               className="animate-rise border-b border-line py-5 text-[28px] font-bold">{n.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
