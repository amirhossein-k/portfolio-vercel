import { PrismaClient } from "@prisma/client";

// اگر Vercel متغیر را با اسم دیگری ساخته باشد، همان را استفاده کن
const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;

const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient(url ? { datasourceUrl: url } : undefined);
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
