"use client";

import { useEffect, useRef, useState } from "react";

const KEY = "zk-intro";
const MIN_MS = 600;
const MAX_MS = 1800;
const FADE_MS = 300;

/**
 * Runs before paint (see layout.tsx): shows the intro once per tab session, only
 * with JS on, motion allowed and outside /admin. Content stays in the DOM behind it.
 */
export const introScript = `try{var d=document.documentElement;if(!sessionStorage.getItem("${KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&location.pathname.indexOf("/admin")!==0){d.classList.add("zk-intro")}}catch(e){}`;

export function IntroLoader({ name }: { name: string }) {
  const [state, setState] = useState<"in" | "out">("in");
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("zk-intro")) return;

    const started = performance.now();
    const bar = barRef.current;
    let done = false;
    let frame = 0;

    // The line tracks elapsed time toward the cap and completes when fonts are ready.
    const tick = () => {
      if (bar) bar.style.transform = `scaleX(${Math.min(0.9, (performance.now() - started) / MAX_MS)})`;
      if (!done) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(frame);
      if (bar) bar.style.transform = "scaleX(1)";
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setState("out");
      window.setTimeout(() => root.classList.remove("zk-intro"), FADE_MS);
    };

    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => window.setTimeout(finish, Math.max(0, MIN_MS - (performance.now() - started))));
    const cap = window.setTimeout(finish, MAX_MS);

    return () => {
      window.clearTimeout(cap);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      data-state={state}
      className="intro fixed inset-0 z-[100] flex-col items-center justify-center gap-6 bg-bg p-6 text-ink"
    >
      <p className="display text-[clamp(4rem,14vw,8rem)] leading-none">ZK.</p>
      <p className="label text-ink-muted">{name}</p>
      <span className="relative block h-px w-48 overflow-hidden bg-line-soft">
        <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-ink" />
      </span>
    </div>
  );
}
