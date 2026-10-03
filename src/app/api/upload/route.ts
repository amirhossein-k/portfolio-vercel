import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { ALLOWED_TYPES, MAX_SIZE } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get(SESSION_COOKIE)?.value;
    if (!(await verifyToken(cookie))) return NextResponse.json({ error: "دسترسی ندارید" }, { status: 401 });

    const fd = await req.formData();
    const file = fd.get("file") as File;
    if (!file) return NextResponse.json({ error: "فایل ضروری است" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "نوع فایل قبول نیست" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "حجم بیش از ۶ مگابایت است" }, { status: 400 });

    const blob = await put(`portfolio/${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${file.name}`, file, { access: "public" });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
