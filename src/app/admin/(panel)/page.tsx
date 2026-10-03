import Link from "next/link";
import { Plus, ArrowUpLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { fa } from "@/lib/utils";
import PageTitle from "@/components/admin/PageTitle";

export default async function AdminHome() {
  const [profile, projects, published, skills, exp, recent] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: 4 }),
  ]);
  const cards = [
    { href: "/admin/projects", n: projects, label: "پروژه", sub: `${fa(published)} منتشرشده` },
    { href: "/admin/skills", n: skills, label: "مهارت" },
    { href: "/admin/experience", n: exp, label: "سابقه‌ی کاری" },
  ];
  return (
    <>
      <PageTitle title={`سلام${profile ? `، ${profile.name.split(" ")[0]}` : ""}`} sub="هر تغییری اینجا بدهید، بلافاصله روی سایت دیده می‌شود.">
        <Link href="/admin/projects/new" className="btn-amber"><Plus size={18} /> پروژه‌ی جدید</Link>
      </PageTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card p-5 transition hover:border-amber/50">
            <p className="text-[40px] font-black leading-none">{fa(c.n)}</p>
            <p className="mt-2 text-[15px] text-muted">{c.label}{c.sub && ` · ${c.sub}`}</p>
          </Link>
        ))}
      </div>
      <h2 className="mb-4 mt-10 text-[18px] font-bold">آخرین ویرایش‌ها</h2>
      <div className="card divide-y divide-line">
        {recent.map((p) => (
          <Link key={p.id} href={`/admin/projects/${p.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-line/30">
            <div className="min-w-0">
              <p className="truncate font-semibold">{p.title}</p>
              <p className="truncate text-[14px] text-muted">{p.tagline}</p>
            </div>
            <ArrowUpLeft size={18} className="shrink-0 text-muted" />
          </Link>
        ))}
        {recent.length === 0 && <p className="p-4 text-muted">هنوز پروژه‌ای ندارید.</p>}
      </div>
      {!profile && <p className="mt-6 text-amber">پروفایل هنوز ساخته نشده، <Link href="/admin/profile" className="underline">الان تکمیلش کنید</Link>.</p>}
    </>
  );
}
