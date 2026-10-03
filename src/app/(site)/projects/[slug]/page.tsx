import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ExternalLink, Github } from "lucide-react";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/data";
import { commas, lines, parseImages } from "@/lib/utils";
import { NAME_FA, PERSON_ID, SITE_URL, WEBSITE_ID, abs, clip } from "@/lib/seo";
import Gallery from "@/components/site/Gallery";
import JsonLd from "@/components/site/JsonLd";
import { Cover } from "@/components/site/ProjectCard";

type Props = { params: Promise<{ slug: string }> };

const getProject = cache(async (slug: string) =>
  prisma.project.findFirst({ where: { slug: decodeURIComponent(slug), published: true } }),
);

const projectPath = (slug: string) => `/projects/${encodeURIComponent(slug)}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).slug);
  if (!p) return { title: "پروژه پیدا نشد", robots: { index: false } };
  const profile = await getProfile();
  const author = profile?.name ?? NAME_FA;
  const description = clip(`${p.tagline}${p.description ? ` ${p.description.replace(/\s+/g, " ")}` : ""}`, 160);
  const title = `${p.title} | نمونه‌کار طراحی سایت`;
  const images = p.cover ? [{ url: abs(p.cover), alt: p.title }] : [{ url: "/og", width: 1200, height: 630, alt: p.title }];
  return {
    title,
    description,
    keywords: [...commas(p.tech), "نمونه کار طراحی سایت", author],
    alternates: { canonical: projectPath(p.slug) },
    authors: [{ name: author, url: SITE_URL }],
    openGraph: {
      type: "article",
      url: projectPath(p.slug),
      title: `${title} | ${author}`,
      description,
      images,
      authors: [author],
      modifiedTime: p.updatedAt.toISOString(),
      publishedTime: p.createdAt.toISOString(),
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}

export default async function ProjectPage({ params }: Props) {
  const p = await getProject((await params).slug);
  if (!p) notFound();
  const features = lines(p.features);
  const tech = commas(p.tech);
  const images = parseImages(p.images);
  const [more, profile] = await Promise.all([
    prisma.project.findMany({ where: { published: true, NOT: { id: p.id } }, take: 2, orderBy: { order: "asc" } }),
    getProfile(),
  ]);
  const url = abs(projectPath(p.slug));
  const author = profile?.name ?? NAME_FA;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: p.title,
        headline: p.title,
        description: p.description || p.tagline,
        abstract: p.tagline,
        url,
        inLanguage: "fa-IR",
        genre: "Web Development",
        about: "طراحی و برنامه‌نویسی وب‌سایت",
        keywords: tech.join(", "),
        ...(p.cover && { image: [abs(p.cover), ...images.map((i) => abs(i))] }),
        ...(p.year && { dateCreated: String(p.year) }),
        datePublished: p.createdAt.toISOString(),
        dateModified: p.updatedAt.toISOString(),
        ...(p.liveUrl && { sameAs: p.liveUrl }),
        ...(p.repoUrl && { codeRepository: p.repoUrl }),
        author: { "@type": "Person", "@id": PERSON_ID, name: author, url: SITE_URL },
        creator: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: author, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "نمونه‌کارها", item: `${SITE_URL}/#projects` },
          { "@type": "ListItem", position: 3, name: p.title, item: url },
        ],
      },
    ],
  };

  return (
    <article className="wrap pb-24 pt-8">
      <JsonLd data={jsonLd} />
      <Link href="/#projects" className="inline-flex items-center gap-1.5 text-[15px] text-muted hover:text-amber"><ArrowRight size={16} /> همه‌ی پروژه‌ها</Link>

      <header className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="animate-rise">
          {p.year && <p className="eyebrow">{p.year}</p>}
          <h1 className="mt-2 text-[40px] font-black leading-tight sm:text-[60px]">{p.title}</h1>
          <p className="mt-3 max-w-2xl text-[18px] leading-8 text-muted sm:text-[20px]">{p.tagline}</p>
          <p className="mt-3 text-[15px] text-muted">طراحی و توسعه: <Link href="/" rel="author" className="text-amber hover:underline">{author}</Link></p>
        </div>
        <div className="flex flex-wrap gap-3">
          {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn-amber">مشاهده‌ی آنلاین <ExternalLink size={16} /></a>}
          {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost"><Github size={17} /> سورس کد</a>}
        </div>
      </header>

      <div className="card mt-10 aspect-[16/9] overflow-hidden"><Cover p={p} /></div>

      {images.length > 0 && <div className="mt-6"><Gallery images={images} title={p.title} /></div>}

      <div className="mt-14 grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div>
          {p.description && (
            <>
              <h2 className="text-[24px] font-bold">درباره‌ی پروژه</h2>
              <p className="mt-4 whitespace-pre-line text-[17px] leading-8 text-paper/85">{p.description}</p>
            </>
          )}
          {features.length > 0 && (
            <>
              <h2 className="mt-12 text-[24px] font-bold">ویژگی‌ها</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {features.map((f) => (
                  <li key={f} className="card flex items-start gap-3 p-4 text-[16px] leading-7">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber/15 text-amber"><Check size={15} /></span>
                    {f}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {tech.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-[18px] font-bold">تکنولوژی‌ها</h2>
            <div className="mt-4 flex flex-wrap gap-2">{tech.map((t) => <span key={t} className="chip" dir="ltr">{t}</span>)}</div>
          </aside>
        )}
      </div>

      {more.length > 0 && (
        <section className="mt-20 border-t border-line pt-10">
          <h2 className="text-[22px] font-bold">پروژه‌های دیگر</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {more.map((m) => (
              <Link key={m.id} href={`/projects/${m.slug}`} className="group card flex items-center gap-4 overflow-hidden p-3 transition hover:border-amber/50">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl"><Cover p={m} className="[&>span]:text-[40px]" /></div>
                <div><p className="text-[18px] font-bold">{m.title}</p><p className="text-[15px] text-muted">{m.tagline}</p></div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
