import type { Profile, Project, Skill } from "@prisma/client";
import { prisma } from "@/lib/db";
import { FAQ, JOB_TITLE, NAME_EN, NAME_FA, SERVICES, SITE_URL, abs, siteDescription } from "@/lib/seo";

// llms.txt: خلاصه‌ی ساختاریافته برای ChatGPT، Claude، Perplexity و سایر مدل‌های زبانی
export const revalidate = 3600;

export async function GET() {
  let profile: Profile | null = null, projects: Project[] = [], skills: Skill[] = [];
  try {
    [profile, projects, skills] = await Promise.all([
      prisma.profile.findUnique({ where: { id: 1 } }),
      prisma.project.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { order: "asc" }] }),
      prisma.skill.findMany({ orderBy: { level: "desc" } }),
    ]);
  } catch {}

  const name = profile?.name ?? NAME_FA;
  const contact = [
    profile?.email && `- Email: ${profile.email}`,
    profile?.phone && `- Phone: ${profile.phone}`,
    profile?.telegram && `- Telegram: ${profile.telegram}`,
    profile?.github && `- GitHub: ${profile.github}`,
    profile?.linkedin && `- LinkedIn: ${profile.linkedin}`,
    profile?.location && `- Location: ${profile.location}`,
  ].filter(Boolean);

  const body = `# ${name} (${NAME_EN})

> ${siteDescription(name)}

${name} (${NAME_EN}) is a freelance full-stack web developer and designer (${JOB_TITLE}) who builds personal/portfolio websites, e-commerce websites (online shops) and professional admin dashboards with Next.js, React and TypeScript. He also builds Telegram and Bale bots and business automation.

Website: ${SITE_URL}

## Services
${SERVICES.map((s) => `- [${s.title}](${SITE_URL}/#service-${s.id}): ${s.description}`).join("\n")}

## Portfolio projects
${projects.map((p) => `- [${p.title}](${abs(`/projects/${encodeURIComponent(p.slug)}`)}): ${p.tagline}${p.tech ? ` (Tech: ${p.tech})` : ""}`).join("\n") || "- See website"}

## Skills
${skills.map((s) => s.name).join(", ") || "Next.js, React, TypeScript, Tailwind, Prisma, PostgreSQL"}

## Contact
${contact.join("\n") || `- ${SITE_URL}/#contact`}

## FAQ
${FAQ.map((f) => `- ${f.q}\n  ${f.a}`).join("\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
