import type { Metadata } from "next";
import { Download, Github, Linkedin, Mail, MapPin, Send, Phone, ArrowDown, User, ShoppingCart, LayoutDashboard, Bot, Check } from "lucide-react";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/data";
import { fa } from "@/lib/utils";
import {
  FAQ, HEADLINE, JOB_TITLE, KEYWORDS, NAME_EN, PERSON_ID, SERVICES, SERVICE_ID, SITE_URL, WEBSITE_ID, abs, siteDescription,
} from "@/lib/seo";
import Terminal from "@/components/site/Terminal";
import ProjectCard from "@/components/site/ProjectCard";
import JsonLd from "@/components/site/JsonLd";

const SERVICE_ICONS = { personal: User, ecommerce: ShoppingCart, dashboard: LayoutDashboard, automation: Bot } as const;

export async function generateMetadata(): Promise<Metadata> {
  const p = await getProfile();
  const name = p?.name ?? undefined;
  const title = `${name ?? "امیرحسین کریمی"} | ${HEADLINE}`;
  const description = siteDescription(name);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: { type: "profile", url: "/", title, description },
    twitter: { title, description },
  };
}

export default async function Home() {
  const [profile, skills, projects, exp] = await Promise.all([
    getProfile(),
    prisma.skill.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
    prisma.project.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { order: "asc" }, { id: "desc" }] }),
    prisma.experience.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
  ]);

  if (!profile) {
    return <div className="wrap py-32 text-center text-muted">ابتدا از داشبورد (/admin) پروفایل را تکمیل کنید.</div>;
  }

  const groups = skills.reduce<Record<string, typeof skills>>((acc, s) => ((acc[s.category] ??= []).push(s), acc), {});
  const top = [...skills].sort((a, b) => b.level - a.level).slice(0, 5).map((s) => s.name).join("  ");
  const [featured, ...rest] = projects;

  const socials = [
    profile.github && { href: profile.github, icon: Github, label: "GitHub" },
    profile.linkedin && { href: profile.linkedin, icon: Linkedin, label: "LinkedIn" },
    profile.telegram && { href: profile.telegram, icon: Send, label: "Telegram" },
  ].filter(Boolean) as { href: string; icon: typeof Github; label: string }[];

  // داده‌ی ساختاریافته: به گوگل و مدل‌های هوش مصنوعی می‌گوید شما چه کسی هستید و چه خدماتی می‌دهید
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: profile.name,
        alternateName: NAME_EN,
        inLanguage: "fa-IR",
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: `${profile.name} | ${HEADLINE}`,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": PERSON_ID },
        dateModified: profile.updatedAt.toISOString(),
        inLanguage: "fa-IR",
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: profile.name,
        alternateName: NAME_EN,
        jobTitle: [profile.title, JOB_TITLE, "Full-Stack Web Developer"],
        description: siteDescription(profile.name),
        url: SITE_URL,
        ...(profile.avatar && { image: abs(profile.avatar) }),
        ...(profile.email && { email: `mailto:${profile.email}` }),
        ...(profile.phone && { telephone: profile.phone }),
        ...(profile.location && { address: { "@type": "PostalAddress", addressLocality: profile.location } }),
        knowsAbout: [...new Set([...skills.map((s) => s.name), "Next.js", "React", "TypeScript", "طراحی سایت", "طراحی داشبورد مدیریت"])],
        knowsLanguage: ["fa", "en"],
        sameAs: socials.map((s) => s.href),
        makesOffer: { "@id": SERVICE_ID },
      },
      {
        "@type": "ProfessionalService",
        "@id": SERVICE_ID,
        name: `خدمات طراحی سایت ${profile.name}`,
        url: `${SITE_URL}/#services`,
        description: siteDescription(profile.name),
        provider: { "@id": PERSON_ID },
        founder: { "@id": PERSON_ID },
        areaServed: [{ "@type": "Country", name: "Iran" }, "Worldwide"],
        availableLanguage: ["fa", "en"],
        ...(profile.avatar && { image: abs(profile.avatar) }),
        ...(profile.phone && { telephone: profile.phone }),
        ...(profile.email && { email: profile.email }),
        keywords: KEYWORDS.join("، "),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "خدمات طراحی و برنامه‌نویسی وب",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.description, url: `${SITE_URL}/#service-${s.id}` },
          })),
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#projects`,
        name: "نمونه‌کارهای طراحی سایت",
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: abs(`/projects/${encodeURIComponent(p.slug)}`),
          name: p.title,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 h-[560px] w-[560px] animate-drift rounded-full bg-amber/10 blur-[120px]" />
        <div className="wrap relative grid items-center gap-12 pb-20 pt-12 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:pb-28">
          <div className="animate-rise">
            {profile.available && (
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-moss/40 bg-moss/10 px-3.5 py-1.5 text-[14px] text-moss">
                <span className="h-2 w-2 animate-pulse rounded-full bg-moss" /> آماده‌ی همکاری
              </span>
            )}
            <h1>
              <span className="block text-[44px] font-black leading-[1.15] tracking-tight sm:text-[64px] lg:text-[76px]">{profile.name}</span>
              <span className="mt-3 block text-[22px] font-bold text-amber sm:text-[28px]">{profile.title}</span>
              <span className="mt-2 block text-[17px] font-medium text-muted sm:text-[19px]">{HEADLINE}</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-8 text-muted sm:text-[18px]">{profile.bio}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#projects" className="btn-amber">نمونه‌کارها <ArrowDown size={17} /></a>
              <a href="#services" className="btn-ghost">خدمات</a>
              <a href="#contact" className="btn-ghost">تماس با من</a>
              {profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-ghost"><Download size={17} /> رزومه</a>}
            </div>
          </div>
          <div className="animate-rise [animation-delay:.15s]">
            <Terminal
              lines={[
                { cmd: "whoami", out: `${profile.name} · ${profile.title}` },
                { cmd: "cat stack.txt", out: top || "—" },
                { cmd: "uptime", out: `${profile.yearsExp}+ years shipping · ${projects.length} projects` },
              ]}
            />
          </div>
        </div>
      </section>

      {/* SERVICES: متن قابل خواندن برای گوگل و هوش مصنوعی درباره‌ی خدمات شما */}
      <section id="services" aria-labelledby="services-title" className="scroll-mt-20 py-16 sm:py-24">
        <div className="wrap">
          <p className="eyebrow">./services</p>
          <h2 id="services-title" className="mt-2 text-[34px] font-black sm:text-[48px]">خدمات طراحی و برنامه‌نویسی وب</h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-8 text-muted">
            {profile.name} هستم، {JOB_TITLE}. وب‌سایت شخصی، سایت فروشگاهی و داشبورد مدیریت اختصاصی را با Next.js و React،
            سریع، امن و سئو شده طراحی و پیاده‌سازی می‌کنم.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {SERVICES.map((s) => {
              const Icon = SERVICE_ICONS[s.id];
              return (
                <article key={s.id} id={`service-${s.id}`} className="card scroll-mt-24 p-6 sm:p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber/15 text-amber"><Icon size={22} /></span>
                  <h3 className="mt-5 text-[22px] font-extrabold">{s.title}</h3>
                  <p className="mt-2 text-[16px] leading-7 text-muted">{s.description}</p>
                  <ul className="mt-4 space-y-2 text-[15px]">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2"><Check size={15} className="text-amber" /> {b}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="scroll-mt-20 py-16 sm:py-24">
        <div className="wrap">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">./projects</p>
              <h2 className="mt-2 text-[34px] font-black sm:text-[48px]">نمونه‌کارهای طراحی سایت</h2>
            </div>
            <span className="font-mono text-[15px] text-muted">{fa(projects.length)} پروژه</span>
          </div>
          {projects.length === 0 ? (
            <p className="text-muted">هنوز پروژه‌ای منتشر نشده.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
              {featured && <ProjectCard p={featured} big={featured.featured} />}
              {rest.map((p) => <ProjectCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="scroll-mt-20 border-y border-line bg-panel/40 py-16 sm:py-24">
        <div className="wrap">
          <p className="eyebrow">./skills</p>
          <h2 className="mt-2 text-[34px] font-black sm:text-[48px]">مهارت‌ها</h2>
          {profile.about && <p className="mt-4 max-w-2xl text-[17px] leading-8 text-muted">{profile.about}</p>}
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {Object.entries(groups).map(([cat, list]) => (
              <div key={cat}>
                <h3 className="mb-5 text-[18px] font-bold">{cat}</h3>
                <ul className="space-y-4">
                  {list.map((s) => (
                    <li key={s.id}>
                      <div className="mb-1.5 flex items-center justify-between font-mono text-[15px]">
                        <span dir="ltr">{s.name}</span>
                        <span className="text-muted">{s.level}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-line">
                        <div className="h-full rounded-full bg-gradient-to-l from-amber to-amber/50" style={{ width: `${Math.min(100, Math.max(5, s.level))}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      {exp.length > 0 && (
        <section id="experience" className="scroll-mt-20 py-16 sm:py-24">
          <div className="wrap grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="eyebrow">./experience</p>
              <h2 className="mt-2 text-[34px] font-black sm:text-[48px]">سوابق کاری</h2>
              <p className="mt-4 text-[64px] font-black leading-none text-amber">{fa(profile.yearsExp)}+</p>
              <p className="text-[16px] text-muted">سال تجربه‌ی حرفه‌ای</p>
            </div>
            <ol className="relative space-y-10 border-r border-line pr-8">
              {exp.map((e, i) => (
                <li key={e.id} className="relative">
                  <span className={`absolute -right-[39px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-ink ${i === 0 ? "bg-amber" : "bg-line"}`} />
                  <p className="font-mono text-[14px] text-muted">{e.period}</p>
                  <h3 className="mt-1 text-[20px] font-bold">{e.role} <span className="font-normal text-muted">· {e.company}</span></h3>
                  {e.description && <p className="mt-2 text-[16px] leading-7 text-muted">{e.description}</p>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* FAQ: پاسخ مستقیم به سوالاتی که مردم از گوگل و ChatGPT می‌پرسند */}
      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 py-16 sm:py-24">
        <div className="wrap max-w-3xl">
          <p className="eyebrow">./faq</p>
          <h2 id="faq-title" className="mt-2 text-[34px] font-black sm:text-[48px]">سوالات متداول طراحی سایت</h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="cursor-pointer list-none text-[18px] font-bold marker:hidden">
                  <h3 className="inline">{f.q}</h3>
                </summary>
                <p className="mt-3 text-[16px] leading-8 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-20 pb-24 pt-8">
        <div className="wrap">
          <div className="card relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-40 mx-auto h-80 w-[80%] animate-drift rounded-full bg-amber/15 blur-[100px]" />
            <h2 className="relative text-[36px] font-black leading-tight sm:text-[56px]">پروژه‌ی بعدی را<br /><span className="text-amber">با هم بسازیم.</span></h2>
            <div className="relative mt-9 flex flex-wrap justify-center gap-3">
              {profile.email && <a href={`mailto:${profile.email}`} className="btn-amber"><Mail size={17} /> <span dir="ltr">{profile.email}</span></a>}
              {profile.phone && <a href={`tel:${profile.phone}`} className="btn-ghost"><Phone size={17} /> <span dir="ltr">{profile.phone}</span></a>}
            </div>
            <div className="relative mt-6 flex justify-center gap-2">
              {socials.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="me noreferrer" aria-label={label}
                   className="grid h-12 w-12 place-items-center rounded-full border border-line transition hover:border-amber hover:text-amber"><Icon size={19} /></a>
              ))}
            </div>
            {profile.location && <p className="relative mt-6 inline-flex items-center gap-1.5 text-[15px] text-muted"><MapPin size={15} /> {profile.location}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
