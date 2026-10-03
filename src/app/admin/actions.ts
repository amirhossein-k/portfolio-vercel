"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { deleteImage } from "@/lib/upload";
import { SESSION_COOKIE, checkPassword, createToken, SESSION_MAX_AGE } from "@/lib/auth";
import { num, optStr, parseImages, slugify, str } from "@/lib/utils";

export type FormState = { ok?: boolean; error?: string; message?: string } | undefined;

const refresh = () => revalidatePath("/", "layout");
const fail = (e: unknown): FormState => ({ error: e instanceof Error ? e.message : "خطای ناشناخته" });

/* ---------- AUTH ---------- */
export async function login(_: FormState, fd: FormData): Promise<FormState> {
  await new Promise((r) => setTimeout(r, 400)); // کند کردن حدس رمز
  if (!checkPassword(str(fd, "password"))) return { error: "رمز اشتباه است." };
  (await cookies()).set(SESSION_COOKIE, await createToken(), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ---------- PROFILE ---------- */
export async function saveProfile(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const name = str(fd, "name"), title = str(fd, "title"), bio = str(fd, "bio");
    if (!name || !title || !bio) return { error: "نام، عنوان و معرفی کوتاه الزامی است." };
    const current = await prisma.profile.findUnique({ where: { id: 1 } });
    const avatar = String(fd.get("avatar") ?? "").trim() || null;
    if (current?.avatar && current.avatar !== avatar) await deleteImage(current.avatar);
    const data = {
      name, title, bio, avatar,
      about: str(fd, "about"),
      location: optStr(fd, "location"), email: optStr(fd, "email"), phone: optStr(fd, "phone"),
      github: optStr(fd, "github"), linkedin: optStr(fd, "linkedin"), telegram: optStr(fd, "telegram"),
      resumeUrl: optStr(fd, "resumeUrl"),
      yearsExp: num(fd, "yearsExp", 5),
      available: fd.get("available") === "on",
    };
    await prisma.profile.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
    refresh();
    return { ok: true, message: "پروفایل ذخیره شد." };
  } catch (e) { return fail(e); }
}

/* ---------- PROJECTS ---------- */
export async function saveProject(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  let newId: number | null = null;
  try {
    const id = num(fd, "id", 0) || null;
    const title = str(fd, "title"), tagline = str(fd, "tagline");
    if (!title || !tagline) return { error: "عنوان و توضیح کوتاه الزامی است." };
    const slug = slugify(str(fd, "slug") || title);
    if (!slug) return { error: "آدرس (slug) نامعتبر است." };
    const clash = await prisma.project.findUnique({ where: { slug } });
    if (clash && clash.id !== id) return { error: "پروژه‌ی دیگری با همین آدرس وجود دارد." };

    const existing = id ? await prisma.project.findUnique({ where: { id } }) : null;

    const cover = String(fd.get("cover") ?? "").trim() || null;
    if (existing?.cover && existing.cover !== cover) await deleteImage(existing.cover);

    const images = fd.getAll("images").map((u) => String(u).trim()).filter(Boolean);
    for (const u of parseImages(existing?.images)) if (!images.includes(u)) await deleteImage(u);

    const yearRaw = num(fd, "year", 0);
    const data = {
      title, tagline, slug, cover,
      description: str(fd, "description"),
      features: str(fd, "features"),
      tech: str(fd, "tech"),
      liveUrl: optStr(fd, "liveUrl"), repoUrl: optStr(fd, "repoUrl"),
      images: JSON.stringify(images),
      year: yearRaw || null,
      order: num(fd, "order", 0),
      featured: fd.get("featured") === "on",
      published: fd.get("published") === "on",
    };
    if (existing) {
      await prisma.project.update({ where: { id: existing.id }, data });
    } else {
      newId = (await prisma.project.create({ data })).id;
    }
    refresh();
    if (!newId) return { ok: true, message: "پروژه ذخیره شد." };
  } catch (e) { return fail(e); }
  redirect(`/admin/projects/${newId}?created=1`);
}

export async function deleteProject(id: number) {
  await requireAdmin();
  const p = await prisma.project.findUnique({ where: { id } });
  if (!p) return;
  await deleteImage(p.cover);
  for (const u of parseImages(p.images)) await deleteImage(u);
  await prisma.project.delete({ where: { id } });
  refresh();
  redirect("/admin/projects");
}

export async function togglePublished(id: number) {
  await requireAdmin();
  const p = await prisma.project.findUnique({ where: { id } });
  if (p) await prisma.project.update({ where: { id }, data: { published: !p.published } });
  refresh();
}

/* ---------- SKILLS ---------- */
export async function saveSkill(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id", 0);
  const name = str(fd, "name"), category = str(fd, "category") || "سایر";
  if (!name) return;
  const data = { name, category, level: Math.min(100, Math.max(0, num(fd, "level", 80))), order: num(fd, "order", 0) };
  if (id) await prisma.skill.update({ where: { id }, data });
  else await prisma.skill.create({ data });
  refresh();
}

export async function deleteSkill(id: number) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } }).catch(() => null);
  refresh();
}

/* ---------- EXPERIENCE ---------- */
export async function saveExperience(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id", 0);
  const role = str(fd, "role"), company = str(fd, "company");
  if (!role || !company) return;
  const data = { role, company, period: str(fd, "period"), description: str(fd, "description"), order: num(fd, "order", 0) };
  if (id) await prisma.experience.update({ where: { id }, data });
  else await prisma.experience.create({ data });
  refresh();
}

export async function deleteExperience(id: number) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } }).catch(() => null);
  refresh();
}
