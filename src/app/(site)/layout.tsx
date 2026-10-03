import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });
  const name = profile?.name ?? "پورتفولیو";
  return (
    <>
      <Header name={name} />
      <main>{children}</main>
      <Footer name={name} />
    </>
  );
}
