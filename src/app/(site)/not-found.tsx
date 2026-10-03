import Link from "next/link";
export default function NotFound() {
  return (
    <div className="wrap grid min-h-[60dvh] place-items-center text-center">
      <div>
        <p dir="ltr" className="font-mono text-[80px] font-black text-amber">404</p>
        <p className="text-muted">این صفحه پیدا نشد.</p>
        <Link href="/" className="btn-ghost mt-6">بازگشت به خانه</Link>
      </div>
    </div>
  );
}
