import { cache } from "react";
import { prisma } from "@/lib/db";

// یک‌بار کوئری در هر درخواست، مشترک بین layout، متادیتا و صفحه
export const getProfile = cache(() => prisma.profile.findUnique({ where: { id: 1 } }));
