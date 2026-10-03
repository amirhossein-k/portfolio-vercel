import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import PageTitle from "@/components/admin/PageTitle";
import { DeleteButton } from "@/components/admin/ui";
import { Cover } from "@/components/site/ProjectCard";
import { deleteProject, togglePublished } from "../../actions";

export default async function ProjectsAdmin() {
  const projects = await prisma.project.findMany({ orderBy: [{ order: "asc" }, { id: "desc" }] });
  return (
    <>
      <PageTitle title="پروژه‌ها" sub="نمونه‌کارهایی که روی سایت نمایش داده می‌شوند.">
        <Link href="/admin/projects/new" className="btn-amber"><Plus size={18} /> پروژه‌ی جدید</Link>
      </PageTitle>
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="card flex flex-wrap items-center gap-4 p-3 sm:flex-nowrap">
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl"><Cover p={p} className="[&>span]:text-[32px]" /></div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate font-bold">
                {p.featured && <Star size={15} className="shrink-0 fill-amber text-amber" />}{p.title}
              </p>
              <p className="truncate text-[14px] text-muted">{p.tagline}</p>
              <span className={`mt-1 inline-block rounded-full px-2 text-[14px] ${p.published ? "bg-moss/15 text-moss" : "bg-line text-muted"}`}>
                {p.published ? "منتشرشده" : "پیش‌نویس"}
              </span>
            </div>
            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <form action={togglePublished.bind(null, p.id)}>
                <button className="btn-ghost h-11 w-11 px-0" aria-label={p.published ? "عدم انتشار" : "انتشار"} title={p.published ? "عدم انتشار" : "انتشار"}>
                  {p.published ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </form>
              <Link href={`/admin/projects/${p.id}`} className="btn-ghost"><Pencil size={16} /> ویرایش</Link>
              <DeleteButton action={deleteProject.bind(null, p.id)} compact confirmText={`پروژه‌ی «${p.title}» حذف شود؟`} />
            </div>
          </div>
        ))}
        {projects.length === 0 && <div className="card p-10 text-center text-muted">هنوز پروژه‌ای اضافه نکرده‌اید.</div>}
      </div>
    </>
  );
}
