# ارتقای سئو پورتفولیو (گوگل + هوش مصنوعی)

## نصب
فایل‌های این پوشه را با همین مسیرها در ریپو کپی کنید (فایل‌های هم‌نام جایگزین می‌شوند)، سپس commit و push کنید.

### فایل‌های تغییر کرده
- `src/app/layout.tsx`: متادیتای کامل (metadataBase، قالب عنوان، OG، Twitter، robots، verification)، `lang="fa-IR"`
- `src/app/(site)/layout.tsx`: حذف force-dynamic و استفاده از ISR (سرعت بیشتر = رتبه‌ی بهتر)
- `src/app/(site)/page.tsx`: h1 کلیدواژه‌دار، بخش «خدمات»، بخش «سوالات متداول»، JSON-LD کامل (Person، ProfessionalService، WebSite، ProfilePage، ItemList، FAQPage)
- `src/app/(site)/projects/[slug]/page.tsx`: canonical، OG مقاله، JSON-LD از نوع CreativeWork + Breadcrumb، لینک نویسنده
- `src/components/site/Footer.tsx`: لینک داخلی به خدمات

### فایل‌های جدید
- `src/lib/seo.ts`: مرکز تنظیمات (کلمات کلیدی، متن خدمات، FAQ). متن‌ها را همین‌جا شخصی کنید.
- `src/lib/data.ts`، `src/components/site/JsonLd.tsx`
- `src/app/sitemap.ts` → `/sitemap.xml` · `src/app/robots.ts` → `/robots.txt`
- `src/app/llms.txt/route.ts` → `/llms.txt` (معرفی شما به ChatGPT، Claude، Perplexity)
- `src/app/og/route.tsx` → تصویر پیش‌نمایش لینک · `icon.tsx` و `apple-icon.tsx` → فاوآیکن · `manifest.ts`
- `src/app/admin/layout.tsx`: noindex برای داشبورد

## دو تغییر کوچک دستی (اختیاری)
1. `src/components/site/Header.tsx` ← به آرایه‌ی `NAV` در ابتدا اضافه کنید:
   `{ href: "/#services", label: "خدمات" },`
2. `src/components/site/ProjectCard.tsx` ← در `Cover` به‌جای `loading="lazy"` بنویسید `loading="lazy" decoding="async"` و alt را `alt={`نمونه‌کار طراحی سایت ${p.title}`}` کنید.

## متغیرهای محیطی در Vercel
- `NEXT_PUBLIC_SITE_URL` = آدرس نهایی سایت (مثلاً https://amirkarimi.ir)
- `GOOGLE_SITE_VERIFICATION` = کد تأیید Google Search Console (فقط مقدار content)
- `BING_SITE_VERIFICATION` = کد Bing Webmaster (ChatGPT از ایندکس بینگ استفاده می‌کند)

## کارهای خارج از کد (به همان اندازه مهم)
1. **دامنه‌ی اختصاصی** بگیرید (`.ir` یا `.com`). زیردامنه‌ی vercel.app اعتبار کمی نزد گوگل دارد.
2. در **Google Search Console** و **Bing Webmaster Tools** سایت را ثبت و `sitemap.xml` را Submit کنید.
3. در داشبورد سایت (`/admin`):
   - عنوان: «طراح و برنامه‌نویس فول‌استک وب‌سایت (Next.js)»
   - bio: یک جمله‌ی کامل حدود ۱۵۰ کاراکتر شامل «طراحی سایت شخصی، فروشگاهی و داشبورد مدیریت»
   - غلط‌های تایپی را اصلاح کنید: «روپردازی» و «سیتسم»
   - slug پروژه‌ها انگلیسی و کوتاه باشد (مثل `marlo-shop`)، توضیح هر پروژه حداقل ۳ پاراگراف (مسئله، راه‌حل، نتیجه)
   - آواتار، ایمیل، تلگرام، گیت‌هاب و لینکدین را پر کنید (برای اسکیمای Person و sameAs)
4. **بک‌لینک و هویت**: لینک سایت را در پروفایل GitHub، LinkedIn، تلگرام، ویرگول و پونیشا/کارلنسر بگذارید و همه‌جا از یک نام ثابت استفاده کنید: «امیرحسین کریمی (Amirhossein Karimi)». هوش مصنوعی‌ها شما را از همین تکرار سازگار می‌شناسند.
5. بعد از دیپلوی تست کنید: https://search.google.com/test/rich-results و https://pagespeed.web.dev
