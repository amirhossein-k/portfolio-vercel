import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import PageTitle from "@/components/admin/PageTitle";
import ProjectForm from "@/components/admin/ProjectForm";
import { DeleteButton } from "@/components/admin/ui";
import { deleteProject } from "../../../actions";

export default async function EditProject({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }>;
}) {
  const id = Number((await params).id);
  const p = Number.isFinite(id) ? await prisma.project.findUnique({ where: { id } }) : null;
  if (!p) notFound();
  const created = (await searchParams).created === "1";
  return (
    <>
      <Link href="/admin/projects" className="mb-4 inline-flex items-center gap-1.5 text-[15px] text-muted hover:text-amber"><ArrowRight size={16} /> پروژه‌ها</Link>
      <PageTitle title={p.title} sub={p.published ? "منتشرشده" : "پیش‌نویس"}>
        <div className="flex gap-2">
          {p.published && <a href={`/projects/${p.slug}`} target="_blank" className="btn-ghost"><ExternalLink size={16} /> مشاهده</a>}
          <DeleteButton action={deleteProject.bind(null, p.id)} confirmText={`پروژه‌ی «${p.title}» حذف شود؟`} />
        </div>
      </PageTitle>
      <ProjectForm p={p} created={created} />
    </>
  );
}
