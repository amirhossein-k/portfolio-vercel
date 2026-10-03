export default function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-line py-8">
      <div className="wrap flex flex-col items-center justify-between gap-3 text-[14px] text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} {name}</span>
        <span dir="ltr" className="font-mono">built with Next.js</span>
      </div>
    </footer>
  );
}
