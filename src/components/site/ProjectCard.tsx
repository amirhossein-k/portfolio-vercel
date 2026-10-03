import Link from "next/link";
import { ArrowUpLeft, ExternalLink } from "lucide-react";
import { commas, cn } from "@/lib/utils";
import type { Project } from "@prisma/client";

export function Cover({ p, className }: { p: Pick<Project, "cover" | "title">; className?: string }) {
  return p.cover ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={p.cover} alt={p.title} loading="lazy" className={cn("h-full w-full object-contain transition duration-700 group-hover:scale-[1.04]", className)} />
  ) : (
    <div className={cn("relative grid h-full w-full place-items-center overflow-hidden bg-[radial-gradient(120%_120%_at_100%_0%,#2a3a22_0%,#151c16_55%)]", className)}>
      <span className="select-none text-[96px] font-black leading-none text-amber/90">{p.title.trim().charAt(0)}</span>
    </div>
  );
}

export default function ProjectCard({ p, big = false }: { p: Project; big?: boolean }) {
  const tech = commas(p.tech).slice(0, big ? 6 : 4);
  return (
    <article className={cn("group card relative flex flex-col overflow-hidden transition hover:-translate-y-1 hover:border-amber/50", big && "md:col-span-2 md:flex-row")}>
      <Link href={`/projects/${p.slug}`} className={cn("block aspect-[16/10] overflow-hidden", big && "md:aspect-auto md:w-[58%]")} aria-label={p.title}>
        <Cover p={p} />
      </Link>
      <div className={cn("flex flex-1 flex-col p-5 sm:p-6", big && "md:justify-center md:p-10")}>
        <div className="mb-2 flex items-center gap-3 font-mono text-[14px] text-muted">
          {big && <span className="rounded-full bg-amber/15 px-2.5 py-0.5 text-amber">پروژه‌ی ویژه</span>}
          {p.year && <span>{p.year}</span>}
        </div>
        <h3 className={cn("font-extrabold leading-tight", big ? "text-[30px] sm:text-[38px]" : "text-[22px]")}>
          <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0">{p.title}</Link>
        </h3>
        <p className="mt-2 text-[16px] leading-7 text-muted">{p.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2" dir="ltr" style={{ justifyContent: "flex-end" }}>
          {tech.map((t) => <span key={t} className="chip">{t}</span>)}
        </div>
        <div className="relative z-10 mt-auto flex items-center gap-2 pt-6">
          <Link href={`/projects/${p.slug}`} className="btn-amber">جزئیات <ArrowUpLeft size={17} /></Link>
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn-ghost">دمو <ExternalLink size={16} /></a>
          )}
        </div>
      </div>
    </article>
  );
}
