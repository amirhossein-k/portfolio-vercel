"use client";
import { useEffect, useState } from "react";

type Line = { cmd: string; out: string };

export default function Terminal({ lines }: { lines: Line[] }) {
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setShown(lines.length);
  }, [lines.length]);

  useEffect(() => {
    if (shown >= lines.length) return;
    const cmd = lines[shown].cmd;
    const t = typed.length < cmd.length
      ? setTimeout(() => setTyped(cmd.slice(0, typed.length + 1)), 45 + Math.random() * 50)
      : setTimeout(() => { setShown((s) => s + 1); setTyped(""); }, 380);
    return () => clearTimeout(t);
  }, [typed, shown, lines]);

  return (
    <div dir="ltr" className="card overflow-hidden text-left shadow-[0_30px_80px_-30px_rgba(215,154,58,.25)]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-brick/80" />
        <span className="h-3 w-3 rounded-full bg-amber/80" />
        <span className="h-3 w-3 rounded-full bg-moss/80" />
        <span className="ml-3 font-mono text-[14px] text-muted">~/portfolio</span>
      </div>
      <div className="min-h-[244px] space-y-3 p-5 font-mono text-[14px] leading-relaxed sm:text-[15px]">
        {lines.slice(0, shown).map((l, i) => (
          <div key={i}>
            <div><span className="text-moss">❯</span> {l.cmd}</div>
            <div className="whitespace-pre-wrap text-muted" dir="auto">{l.out}</div>
          </div>
        ))}
        <div>
          <span className="text-moss">❯</span> {shown < lines.length ? typed : ""}
          <span className="ml-0.5 inline-block h-[1.1em] w-2 translate-y-[3px] animate-blink bg-amber" />
        </div>
      </div>
    </div>
  );
}
