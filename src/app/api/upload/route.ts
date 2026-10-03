import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { ALLOWED_TYPES, MAX_SIZE } from "@/lib/upload";

// آپلود مستقیم از مرورگر به Vercel Blob (دور زدن محدودیت ۴.۵ مگابایتی سرورلس)
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const cookie = request.headers.get("cookie") ?? "";
        const token = cookie.split(/;\s*/).find((c) => c.startsWith(`${SESSION_COOKIE}=`))?.split("=")[1];
        if (!(await verifyToken(token ? decodeURIComponent(token) : null))) throw new Error("دسترسی ندارید");
        return { allowedContentTypes: ALLOWED_TYPES, maximumSizeInBytes: MAX_SIZE, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
