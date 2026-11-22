"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const KEY = "zk-intro";
const MIN_MS = 1000; // lets the entrance animation finish
const MAX_MS = 1800;
const FILL_MS = 350; // line glides to full from wherever it is
const HOLD_MS = 300; // pause on the full line before the curtain
const EXIT_MS = FILL_MS + HOLD_MS + 500; // then the panel slides up

/**
 * Runs before paint (see layout.tsx): shows the intro once per tab session, only
 * with JS on, motion allowed and outside /admin. Content stays in the DOM behind it.
 */
export const introScript = `try{var d=document.documentElement;if(!sessionStorage.getItem("${KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&location.pathname.indexOf("/admin")!==0){d.classList.add("zk-intro")}}catch(e){}`;

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** All motion is CSS, so it plays from first paint, before hydration. */
export function IntroLoader({ name }: { name: string }) {
  const [state, setState] = useState<"in" | "out">("in");
  const barRef = useRef<HTMLSpanElement>(null);

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

      // Freeze the CSS fill at its current width, then ease it to full, so
      // the end never jumps.
      const bar = barRef.current;
      if (bar?.animate) {
        const from = getComputedStyle(bar).transform;
        bar.getAnimations().forEach((animation) => animation.cancel());
        bar.style.transform = from === "none" ? "scaleX(0)" : from;
        bar
          .animate([{ transform: bar.style.transform }, { transform: "scaleX(1)" }], {
            duration: FILL_MS,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            fill: "forwards",
          })
          .finished.then(() => {
            bar.style.transform = "scaleX(1)";
          })
          .catch(() => {});
      } else if (bar) {
        bar.style.transform = "scaleX(1)";
      }
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
        <span ref={barRef} className="intro-bar absolute inset-0 origin-left bg-ink" />
      </span>
    </div>
  );
}
