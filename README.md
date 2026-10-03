# پورتفولیوی فول‌استک: نسخه‌ی Vercel

Next.js 15 · React 19 · TypeScript · Tailwind · Prisma · **Postgres (Neon)** · **Vercel Blob**

همان سایت و داشبورد نسخه‌ی اصلی، با دو تغییر برای سرورلس:
- دیتابیس: SQLite ← Postgres
- عکس‌ها مستقیم از مرورگر روی Vercel Blob آپلود می‌شوند (محدودیت ۴.۵ مگابایتی درخواست‌های Vercel دور زده می‌شود)

## انتشار روی Vercel (حدود ۵ دقیقه)
1. پروژه را در یک ریپوی GitHub پوش کنید.
2. در vercel.com ‏← **Add New → Project** ‏← ریپو را Import کنید (هنوز Deploy نزنید، یا اگر زدید و خطا داد مشکلی نیست).
3. تب **Storage** پروژه:
   - **Create Database → Neon (Postgres)** ‏← Connect. متغیرهای `DATABASE_URL` و `DATABASE_URL_UNPOOLED` خودکار اضافه می‌شوند.
   - **Create → Blob** ‏← Connect. متغیر `BLOB_READ_WRITE_TOKEN` خودکار اضافه می‌شود.
4. **Settings → Environment Variables** این دو را اضافه کنید:
   - `ADMIN_PASSWORD` رمز داشبورد
   - `AUTH_SECRET` یک رشته‌ی تصادفی (`openssl rand -hex 32`)
5. **Deployments → Redeploy**. جدول‌ها هنگام build خودکار ساخته می‌شوند (`prisma db push`).
6. به `your-site.vercel.app/admin` بروید، وارد شوید و پروفایل و پروژه‌ها را اضافه کنید.

### داده‌ی نمونه (اختیاری)
```bash
npm i -g vercel && vercel link && vercel env pull .env
npm install && npm run db:seed
```

## اجرای لوکال
```bash
npm install
vercel env pull .env     # یا .env.example را کپی و پر کنید
npm run setup            # ساخت جدول‌ها + داده‌ی نمونه
npm run dev
```
> آپلود عکس در لوکال هم کار می‌کند، چون مستقیم به Blob می‌رود.

## دامنه‌ی شخصی
Settings → Domains ‏← دامنه را اضافه و رکوردهای DNS را طبق راهنمای Vercel تنظیم کنید.

## نکات
- اگر از Supabase یا دیتابیس دیگری استفاده می‌کنید، `DATABASE_URL` (pooled) و `DATABASE_URL_UNPOOLED` (direct) را دستی بگذارید.
- تغییر مدل دیتابیس: `prisma/schema.prisma` را ویرایش کنید؛ build بعدی خودش اعمال می‌کند (تغییرات مخرب را رد می‌کند تا داده‌ای پاک نشود).
- رنگ‌ها: `tailwind.config.ts`
