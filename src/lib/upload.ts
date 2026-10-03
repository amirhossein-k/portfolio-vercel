import "server-only";
import { del } from "@vercel/blob";

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const MAX_SIZE = 6 * 1024 * 1024;

const isBlob = (u?: string | null) => !!u && /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(u);

/** فقط آدرس‌های https قبول می‌شود */
export const cleanUrl = (u: unknown) => (typeof u === "string" && u.startsWith("https://") ? u : null);

export async function deleteImage(url?: string | null) {
  if (!isBlob(url)) return;
  try { await del(url!); } catch {}
}
