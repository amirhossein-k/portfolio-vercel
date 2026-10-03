// جدول‌ها را با اتصال مستقیم (non-pooled) می‌سازد؛ هر اسمی که Vercel/Neon/Supabase به متغیر داده باشد را پیدا می‌کند
import { execSync } from "node:child_process";

const pick = (...keys) => keys.map((k) => process.env[k]).find(Boolean);
const direct = pick("DATABASE_URL_UNPOOLED", "POSTGRES_URL_NON_POOLING", "DIRECT_URL", "DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL");

if (!direct) {
  console.error("\n✖ هیچ آدرس دیتابیسی پیدا نشد. در Vercel → Storage یک دیتابیس Postgres (Neon) به پروژه وصل کنید.\n");
  process.exit(1);
}
execSync("prisma db push --skip-generate", { stdio: "inherit", env: { ...process.env, DATABASE_URL: direct } });
