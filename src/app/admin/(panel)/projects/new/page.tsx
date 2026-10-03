import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageTitle from "@/components/admin/PageTitle";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProject() {
  return (
    <>
      <Link href="/admin/projects" className="mb-4 inline-flex items-center gap-1.5 text-[15px] text-muted hover:text-amber"><ArrowRight size={16} /> پروژه‌ها</Link>
      <PageTitle title="پروژه‌ی جدید" />
      <ProjectForm />
    </>
  );
}
