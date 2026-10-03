import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getProfile } from "@/lib/data";
import { NAME_FA } from "@/lib/seo";

// به‌جای force-dynamic: صفحات استاتیک + بازسازی هر ساعت (ISR).
// چون اکشن‌های داشبورد revalidatePath("/", "layout") صدا می‌زنند، تغییرات فوراً روی سایت می‌آید.
// سرعت بارگذاری (TTFB / Core Web Vitals) مستقیماً روی رتبه‌ی گوگل اثر دارد.
export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  const name = profile?.name ?? NAME_FA;
  return (
    <>
      <Header name={name} />
      <main>{children}</main>
      <Footer name={name} />
    </>
  );
}
