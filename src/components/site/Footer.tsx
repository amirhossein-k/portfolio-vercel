import Link from "next/link";
import { SERVICES } from "@/lib/seo";

export default function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-line py-8">
      <div className="wrap flex flex-col gap-6 text-[14px] text-muted">
        <nav aria-label="خدمات" className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:justify-start">
          {SERVICES.map((s) => (
            <Link key={s.id} href={`/#service-${s.id}`} className="transition hover:text-amber">{s.title}</Link>
          ))}
        </nav>
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <span>© {new Date().getFullYear()} {name} · طراح و برنامه‌نویس وب‌سایت</span>
          <span dir="ltr" className="font-mono">built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}
