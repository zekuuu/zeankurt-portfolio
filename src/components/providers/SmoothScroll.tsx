"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { hashTarget, scrollToTarget, setLenis } from "@/lib/smooth-scroll";

/**
 * Inertial wheel scrolling (off under reduced motion and on /admin; touch keeps
 * native scrolling), plus one handler for every same-page hash link so nav,
 * CTAs and footer links all land exactly on their section.
 */
export function SmoothScroll() {
  const pathname = usePathname() ?? "/";
  const enabled = !pathname.startsWith("/admin");

  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      prevent: (node) => Boolean(node.closest("dialog, [data-lenis-prevent]")),
    });
    setLenis(lenis);

    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, [enabled]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const target = hashTarget(anchor);
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", `${window.location.pathname}${anchor.hash}`);
      window.dispatchEvent(new Event("hashchange"));
      requestAnimationFrame(() => scrollToTarget(target));
    };

    // Capture phase: runs before Next's <Link> handler, which would jump instantly.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
