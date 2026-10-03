"use client";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [i, setI] = useState<number | null>(null);
  const go = useCallback((d: number) => setI((v) => (v === null ? v : (v + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (i === null) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowLeft") go(1);
      if (e.key === "ArrowRight") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", on);
    return () => { window.removeEventListener("keydown", on); document.body.style.overflow = ""; };
  }, [i, go]);

  if (!images.length) return null;
  return (
    <>
      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8 [scrollbar-width:thin]">
        {images.map((src, idx) => (
          <button key={src} onClick={() => setI(idx)} className="group card w-[82%] shrink-0 snap-center overflow-hidden sm:w-[60%] lg:w-[46%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${title} ${idx + 1}`} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          </button>
        ))}
      </div>
      {i !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/95 p-4 backdrop-blur" onClick={() => setI(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[i]} alt="" className="max-h-[82dvh] max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
          <button aria-label="بستن" className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-line bg-panel" onClick={() => setI(null)}><X size={20} /></button>
          {images.length > 1 && (
            <div className="absolute bottom-6 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
              <button aria-label="قبلی" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-panel" onClick={() => go(-1)}><ChevronRight /></button>
              <span className="font-mono text-[14px] text-muted">{i + 1} / {images.length}</span>
              <button aria-label="بعدی" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-panel" onClick={() => go(1)}><ChevronLeft /></button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
