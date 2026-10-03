// توکن جلسه با HMAC — هم در Edge (middleware) و هم در Node کار می‌کند
export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // ۷ روز

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sign(value: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) throw new Error("AUTH_SECRET باید حداقل ۱۶ کاراکتر باشد");
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(value)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function createToken() {
  const exp = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${exp}.${await sign(exp)}`;
}

export async function verifyToken(token?: string | null) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  try {
    return safeEqual(sig, await sign(exp));
  } catch {
    return false;
  }
}

export function checkPassword(input: string) {
  const real = process.env.ADMIN_PASSWORD ?? "";
  return real.length > 0 && safeEqual(input, real);
}
