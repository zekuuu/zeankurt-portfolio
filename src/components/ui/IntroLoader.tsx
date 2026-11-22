"use client";

import { useEffect, useState, type CSSProperties } from "react";

const KEY = "zk-intro";
const MIN_MS = 1000; // lets the entrance animation finish
const MAX_MS = 1800;
const EXIT_MS = 700; // line completes, then the panel slides up

/**
 * Runs before paint (see layout.tsx): shows the intro once per tab session, only
 * with JS on, motion allowed and outside /admin. Content stays in the DOM behind it.
 */
export const introScript = `try{var d=document.documentElement;if(!sessionStorage.getItem("${KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&location.pathname.indexOf("/admin")!==0){d.classList.add("zk-intro")}}catch(e){}`;

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** All motion is CSS, so it plays from first paint, before hydration. */
export function IntroLoader({ name }: { name: string }) {
  const [state, setState] = useState<"in" | "out">("in");

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("zk-intro")) return;

    const started = performance.now();
    let done = false;
    let exitTimer = 0;

    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setState("out");
      exitTimer = window.setTimeout(() => root.classList.remove("zk-intro"), EXIT_MS);
    };

    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => window.setTimeout(finish, Math.max(0, MIN_MS - (performance.now() - started))));
    const cap = window.setTimeout(finish, MAX_MS);

    return () => {
      window.clearTimeout(cap);
      window.clearTimeout(exitTimer);
    };
  }, []);

  return (
    <div
      aria-hidden
      data-state={state}
      className="intro fixed inset-0 z-[100] flex-col items-center justify-center gap-6 bg-bg p-6 text-ink"
    >
      <p className="display flex overflow-hidden pb-[0.08em] text-[clamp(4rem,14vw,8rem)] leading-none">
        <span className="intro-char" style={delay(0)}>
          Z
        </span>
        <span className="intro-char" style={delay(90)}>
          K
        </span>
        <span className="intro-char text-primary" style={delay(200)}>
          .
        </span>
      </p>
      <p className="intro-fade label text-ink-muted" style={delay(380)}>
        {name}
      </p>
      <span className="intro-fade relative block h-px w-48 overflow-hidden bg-line-soft" style={delay(380)}>
        <span className="intro-bar absolute inset-0 origin-left bg-ink" />
      </span>
    </div>
  );
}
