export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export const lines = (s?: string | null) => (s ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
export const commas = (s?: string | null) => (s ?? "").split(/[,،]/).map((l) => l.trim()).filter(Boolean);

export function parseImages(s?: string | null): string[] {
  try {
    const v = JSON.parse(s ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function slugify(s: string) {
  return s.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

const faDigits = "۰۱۲۳۴۵۶۷۸۹";
export const fa = (n: number | string) => String(n).replace(/\d/g, (d) => faDigits[+d]);

export const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
export const optStr = (fd: FormData, k: string) => str(fd, k) || null;
export const num = (fd: FormData, k: string, d = 0) => {
  const n = parseInt(str(fd, k).replace(/[۰-۹]/g, (x) => String(faDigits.indexOf(x))), 10);
  return Number.isFinite(n) ? n : d;
};
