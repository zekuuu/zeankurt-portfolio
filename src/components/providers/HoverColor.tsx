"use client";

import { useEffect } from "react";

/** [fill, text, border] per accent; all tokens, so both themes stay readable. */
const NAMES = ["primary", "yellow", "orange", "green"] as const;
const ACCENTS = [
  ["var(--primary)", "var(--on-primary)", "var(--primary)"],
  ["var(--block-yellow)", "var(--on-block)", "var(--on-block)"],
  ["var(--block-orange)", "var(--on-block)", "var(--on-block)"],
  ["var(--block-green)", "var(--on-block)", "var(--on-block)"],
] as const;

/**
 * Every `.hover-fill` / `.hover-group` element gets a random accent each time
 * it is hovered or focused, never the same twice in a row. Runs after
 * hydration and only writes CSS custom properties, so the server HTML never
 * differs; without JS hovers fall back to ink (see globals.css).
 */
export function HoverColor() {
  useEffect(() => {
    let last = -1; // never the same color twice in a row, even on the same control

    const pick = (event: Event) => {
      const el = (event.target as Element | null)?.closest?.<HTMLElement>(".hover-fill, .hover-group");
      if (!el) return;
      const related = (event as PointerEvent).relatedTarget as Node | null;
      if (related && el.contains(related)) return;

      // `hover-fill-no-<color>` skips the color of the tile the control sits on.
      const pool = ACCENTS.map((_, i) => i).filter(
        (i) => i !== last && !el.classList.contains(`hover-fill-no-${NAMES[i]}`),
      );
      const index = pool[Math.floor(Math.random() * pool.length)];
      last = index;
      const [fill, text, border] = ACCENTS[index];
      el.style.setProperty("--hv", fill);
      el.style.setProperty("--on-hv", text);
      el.style.setProperty("--hv-border", border);
    };

    document.addEventListener("pointerover", pick, { passive: true });
    document.addEventListener("focusin", pick);
    return () => {
      document.removeEventListener("pointerover", pick);
      document.removeEventListener("focusin", pick);
    };
  }, []);

  return null;
}
