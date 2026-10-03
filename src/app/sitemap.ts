import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { abs } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [profile, projects] = await Promise.all([
      prisma.profile.findUnique({ where: { id: 1 }, select: { updatedAt: true } }),
      prisma.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true, cover: true }, orderBy: { order: "asc" } }),
    ]);
    return [
      { url: abs("/"), lastModified: profile?.updatedAt ?? new Date(), changeFrequency: "weekly", priority: 1 },
      ...projects.map((p) => ({
        url: abs(`/projects/${encodeURIComponent(p.slug)}`),
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        ...(p.cover && { images: [abs(p.cover)] }),
      })),
    ];
  } catch {
    return [{ url: abs("/"), lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
  }
}
