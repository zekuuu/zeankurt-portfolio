import type Lenis from "lenis";

/**
 * Single Lenis instance shared by the provider and anything that scrolls or
 * locks the page. Every helper falls back to native behavior when Lenis is off
 * (reduced motion, admin, or not yet mounted).
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function headerOffset() {
  return document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 0;
}

/**
 * Scrolls so the target's top edge lands exactly under the sticky header.
 * Uses a computed number, not the element: Lenis would otherwise subtract
 * scroll-margin-top and scroll-padding-top on top of the offset. Below lg the
 * header slides away when scrolling down, so the offset is 0 in that case.
 */
export function scrollToTarget(target: HTMLElement) {
  const y = target.getBoundingClientRect().top + window.scrollY;
  const headerHides = window.matchMedia("(max-width: 1023px)").matches && y > window.scrollY;
  const top = Math.max(0, Math.round(y - (headerHides ? 0 : headerOffset())));

  if (instance) {
    // force: a closing menu may still hold the scroll lock for one frame.
    instance.scrollTo(top, { force: true });
    return;
  }
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/** Same-page hash link (e.g. "/#projects" while on "/"): returns its target element. */
export function hashTarget(anchor: HTMLAnchorElement) {
  if (!anchor.hash || anchor.target === "_blank") return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return null;
  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
}

export function scrollToTop(immediate = false) {
  if (instance) {
    instance.scrollTo(0, { immediate });
    return;
  }
  window.scrollTo({ top: 0, behavior: immediate || prefersReducedMotion() ? "auto" : "smooth" });
}

/** Stops page scrolling while a dialog or menu is open. Counted, so overlapping locks nest. */
let locks = 0;

export function lockScroll(on: boolean) {
  locks = Math.max(0, locks + (on ? 1 : -1));
  const locked = locks > 0;
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) instance?.stop();
  else instance?.start();
}
