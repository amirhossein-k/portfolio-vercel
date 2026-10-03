"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, User, FolderKanban, Sparkles, Briefcase, ExternalLink, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "خلاصه", icon: LayoutGrid },
  { href: "/admin/profile", label: "پروفایل", icon: User },
  { href: "/admin/projects", label: "پروژه‌ها", icon: FolderKanban },
  { href: "/admin/skills", label: "مهارت‌ها", icon: Sparkles },
  { href: "/admin/experience", label: "سوابق", icon: Briefcase },
];

export default function AdminNav({ logout }: { logout: () => Promise<void> }) {
  const path = usePathname();
  const active = (h: string) => (h === "/admin" ? path === h : path.startsWith(h));
  return (
    <>
      {/* دسکتاپ: سایدبار */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-l border-line bg-panel p-4 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2 py-2 text-[17px] font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber font-mono text-[14px] text-ink">{"</>"}</span> داشبورد
        </Link>
        <nav className="flex flex-col gap-1">
          {ITEMS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] transition",
              active(href) ? "bg-amber/15 text-amber" : "text-muted hover:bg-line/50 hover:text-paper")}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1">
          <a href="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] text-muted hover:text-paper"><ExternalLink size={18} /> مشاهده‌ی سایت</a>
          <form action={logout}><button className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[15px] text-muted hover:text-brick"><LogOut size={18} /> خروج</button></form>
        </div>
      </aside>

      {/* موبایل: نوار پایین */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn("flex flex-col items-center gap-1 py-2.5 text-[14px]", active(href) ? "text-amber" : "text-muted")}>
            <Icon size={20} /> {label}
          </Link>
        ))}
      </nav>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-ink/90 px-5 backdrop-blur lg:hidden">
        <span className="font-bold">داشبورد</span>
        <div className="flex items-center gap-1">
          <a href="/" target="_blank" aria-label="مشاهده‌ی سایت" className="grid h-11 w-11 place-items-center text-muted"><ExternalLink size={18} /></a>
          <form action={logout}><button aria-label="خروج" className="grid h-11 w-11 place-items-center text-muted"><LogOut size={18} /></button></form>
        </div>
      </header>
    </>
  );
}
