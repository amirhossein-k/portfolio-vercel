"use client";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { Loader2, Trash2, X, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Submit({ children = "ذخیره", className }: { children?: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn("btn-amber", className)}>
      {pending && <Loader2 size={16} className="animate-spin" />} {children}
    </button>
  );
}

export function Field({ label, name, defaultValue, type = "text", required, placeholder, ltr, hint }: {
  label: string; name: string; defaultValue?: string | number | null; type?: string; required?: boolean; placeholder?: string; ltr?: boolean; hint?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}{required && <span className="text-amber"> *</span>}</span>
      <input className="input" name={name} type={type} required={required} placeholder={placeholder}
             defaultValue={defaultValue ?? ""} dir={ltr ? "ltr" : undefined} />
      {hint && <span className="mt-1 block text-[14px] text-muted/70">{hint}</span>}
    </label>
  );
}

export function Area({ label, name, defaultValue, rows = 4, hint, required }: {
  label: string; name: string; defaultValue?: string | null; rows?: number; hint?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="label">{label}{required && <span className="text-amber"> *</span>}</span>
      <textarea className="input leading-7" name={name} rows={rows} required={required} defaultValue={defaultValue ?? ""} />
      {hint && <span className="mt-1 block text-[14px] text-muted/70">{hint}</span>}
    </label>
  );
}

export function Toggle({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-line transition after:absolute after:right-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-paper after:transition peer-checked:bg-amber peer-checked:after:-translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-amber/40" />
      {label}
    </label>
  );
}

export function Notice({ state }: { state?: { ok?: boolean; error?: string; message?: string } }) {
  const [show, setShow] = useState(true);
  useEffect(() => setShow(true), [state]);
  if (!state || !show || (!state.error && !state.message)) return null;
  return (
    <div className={cn("flex items-center justify-between rounded-xl border px-4 py-3 text-[15px]",
      state.error ? "border-brick/40 bg-brick/10 text-brick" : "border-moss/40 bg-moss/10 text-moss")}>
      {state.error ?? state.message}
      <button type="button" onClick={() => setShow(false)} aria-label="بستن"><X size={16} /></button>
    </div>
  );
}

export function DeleteButton({ action, confirmText = "مطمئنید؟ این کار قابل برگشت نیست.", label = "حذف", compact }: {
  action: () => Promise<void>; confirmText?: string; label?: string; compact?: boolean;
}) {
  return (
    <form action={action} onSubmit={(e) => { if (!confirm(confirmText)) e.preventDefault(); }}>
      <button type="submit" className={cn("btn-danger", compact && "h-11 w-11 px-0")} aria-label={label}>
        <Trash2 size={16} /> {!compact && label}
      </button>
    </form>
  );
}

/** انتخاب تصویر تکی */
export function SingleImage({ label, name, current }: { label: string; name: string; current?: string | null }) {
  const [url, setUrl] = useState(current ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => setUrl(current ?? ""), [current]);

  async function pick(f?: File) {
    if (!f) return;
    setBusy(true); setErr("");
    try {
      const fd = new FormData(); fd.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error || "خطا در آپلود");
      const { url: u } = await res.json();
      setUrl(u);
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <span className="label">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-4">
        <div className="relative grid h-24 w-36 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-line bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="text-muted" />}
          {busy && <div className="absolute inset-0 grid place-items-center bg-ink/70"><Loader2 className="animate-spin text-amber" /></div>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="btn-ghost cursor-pointer">
            {url ? "تغییر تصویر" : "انتخاب تصویر"}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
          </label>
          {url && !busy && <button type="button" onClick={() => setUrl("")} className="text-right text-[14px] text-brick">حذف تصویر</button>}
        </div>
      </div>
      {err && <p className="mt-2 text-[14px] text-brick">{err}</p>}
    </div>
  );
}

/** گالری چندتصویری */
export function MultiImage({ current }: { current: string[] }) {
  const [list, setList] = useState(current);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");
  const sig = current.join("|");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setList(current), [sig]);

  async function pick(files: File[]) {
    setErr(""); setBusy((b) => b + files.length);
    await Promise.all(files.map(async (f) => {
      try {
        const fd = new FormData(); fd.append("file", f);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error((await res.json()).error || "خطا در آپلود");
        const { url: u } = await res.json();
        setList((l) => [...l, u]);
      } catch (e) { setErr((e as Error).message); }
      finally { setBusy((b) => b - 1); }
    }));
  }

  return (
    <div>
      <span className="label">گالری تصاویر</span>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {list.map((u) => (
          <div key={u} className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line">
            <input type="hidden" name="images" value={u} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => setList(list.filter((k) => k !== u))} aria-label="حذف"
                    className="absolute left-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-ink/80 text-brick"><X size={16} /></button>
          </div>
        ))}
        {Array.from({ length: busy }).map((_, i) => (
          <div key={`b${i}`} className="grid aspect-[16/10] place-items-center rounded-xl border border-amber/40 bg-ink"><Loader2 className="animate-spin text-amber" /></div>
        ))}
        <label className="grid aspect-[16/10] cursor-pointer place-items-center rounded-xl border border-dashed border-line text-muted transition hover:border-amber hover:text-amber">
          <span className="flex flex-col items-center gap-1 text-[14px]"><ImagePlus /> افزودن</span>
          <input type="file" accept="image/*" multiple className="sr-only"
                 onChange={(e) => { pick(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
        </label>
      </div>
      {err && <p className="mt-2 text-[14px] text-brick">{err}</p>}
      <span className="mt-1 block text-[14px] text-muted/70">حداکثر ۶ مگابایت برای هر تصویر. بعد از آپلود، «ذخیره» را بزنید.</span>
    </div>
  );
}
