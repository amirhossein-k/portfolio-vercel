import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "امیر کریمی",
      title: "برنامه‌نویس فول‌استک",
      bio: "محصول وب را از دیتابیس تا آخرین پیکسل می‌سازم؛ سریع، تمیز و قابل نگهداری.",
      about:
        "حدود پنج سال است که اپلیکیشن‌های وب می‌سازم: از طراحی API و دیتابیس تا رابط کاربری ریسپانسیو. روی پرفورمنس، کد خوانا و تجربه‌ی کاربری حساسم.",
      location: "تهران، ایران",
      email: "you@example.com",
      github: "https://github.com/username",
      linkedin: "https://linkedin.com/in/username",
      telegram: "https://t.me/username",
      yearsExp: 5,
      available: true,
    },
  });

  if ((await prisma.skill.count()) === 0) {
    const skills: [string, string, number][] = [
      ["TypeScript", "فرانت‌اند", 92], ["React", "فرانت‌اند", 93], ["Next.js", "فرانت‌اند", 90], ["Tailwind CSS", "فرانت‌اند", 88],
      ["Node.js", "بک‌اند", 90], ["NestJS", "بک‌اند", 80], ["PostgreSQL", "بک‌اند", 82], ["Prisma", "بک‌اند", 85], ["Redis", "بک‌اند", 72],
      ["Docker", "دواپس و ابزار", 78], ["Git", "دواپس و ابزار", 90], ["Linux", "دواپس و ابزار", 75], ["CI/CD", "دواپس و ابزار", 70],
    ];
    await prisma.skill.createMany({ data: skills.map(([name, category, level], i) => ({ name, category, level, order: i })) });
  }

  if ((await prisma.project.count()) === 0) {
    await prisma.project.createMany({
      data: [
        {
          slug: "shop-platform", title: "پلتفرم فروشگاهی", tagline: "فروشگاه آنلاین با پنل مدیریت و درگاه پرداخت",
          description: "یک فروشگاه کامل با مدیریت محصولات، سبد خرید، پرداخت آنلاین و گزارش‌گیری فروش.",
          features: "رندر سمت سرور برای سئوی بهتر\nسبد خرید و پرداخت آنلاین\nپنل مدیریت محصولات و سفارش‌ها\nزمان بارگذاری زیر یک ثانیه",
          tech: "Next.js, TypeScript, PostgreSQL, Prisma, Tailwind", liveUrl: "https://example.com", year: 2025, featured: true, order: 0,
        },
        {
          slug: "realtime-chat", title: "چت بلادرنگ", tagline: "پیام‌رسان تیمی با WebSocket",
          description: "پیام‌رسان تیمی با کانال‌ها، پیام خصوصی و اعلان لحظه‌ای.",
          features: "ارسال پیام لحظه‌ای با WebSocket\nآپلود فایل و تصویر\nوضعیت آنلاین کاربران",
          tech: "React, Node.js, Socket.io, Redis", repoUrl: "https://github.com/username/chat", year: 2024, order: 1,
        },
        {
          slug: "analytics-dashboard", title: "داشبورد تحلیلی", tagline: "نمودارهای زنده برای داده‌های کسب‌وکار",
          description: "داشبورد مدیریتی با نمودارهای تعاملی و فیلترهای پیشرفته.",
          features: "نمودارهای تعاملی\nخروجی اکسل و PDF\nسطح دسترسی چندگانه",
          tech: "Next.js, NestJS, PostgreSQL, Docker", year: 2024, order: 2,
        },
      ],
    });
  }

  if ((await prisma.experience.count()) === 0) {
    await prisma.experience.createMany({
      data: [
        { role: "توسعه‌دهنده ارشد فول‌استک", company: "شرکت نمونه", period: "۱۴۰۲ تا اکنون", description: "رهبری فنی تیم و توسعه‌ی محصول اصلی.", order: 0 },
        { role: "توسعه‌دهنده فول‌استک", company: "استارتاپ نمونه", period: "۱۴۰۰ تا ۱۴۰۲", description: "ساخت MVP و رساندن محصول به هزاران کاربر.", order: 1 },
        { role: "توسعه‌دهنده فرانت‌اند", company: "آژانس نمونه", period: "۱۳۹۹ تا ۱۴۰۰", description: "پیاده‌سازی رابط کاربری ریسپانسیو برای مشتریان.", order: 2 },
      ],
    });
  }
}

main().finally(() => prisma.$disconnect());
