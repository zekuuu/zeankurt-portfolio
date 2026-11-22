"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { mainNav, photographyNav } from "@/data/navigation";
import type { SiteConfig } from "@/types/site";
import type { NavItem } from "@/types";
import { cn } from "@/lib/cn";
import { buttonClass } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
  variant?: "default" | "photography";
  siteConfig: SiteConfig;
}

const isExternal = (item: NavItem) => item.external || item.href.startsWith("http");

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Same-page hash links scroll without a route change. `scroll-margin-top` on
 * every [id] keeps targets clear of the sticky header.
 */
function handleInternalAnchorClick(event: MouseEvent<HTMLElement>, href: string, onNavigate?: () => void) {
  onNavigate?.();

  let url: URL;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return;
  }

  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) {
    return;
  }

  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;

  event.preventDefault();
  window.history.pushState(null, "", `${url.pathname}${url.hash}`);
  window.dispatchEvent(new Event("hashchange"));
  requestAnimationFrame(() =>
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" }),
  );
}

/** Highlights the nav item whose section is in the upper part of the viewport. */
function useActiveSection(items: NavItem[], pathname: string) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (pathname !== "/") {
      setActive("");
      return;
    }

    const sections = items
      .map((item) => item.href.split("#")[1])
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items, pathname]);

  return active;
}

function NavAnchor({
  item,
  active,
  className,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  className: string;
  onNavigate?: () => void;
}) {
  if (isExternal(item)) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onNavigate}>
        {item.label}
        <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "location" : undefined}
      className={className}
      onClick={(event) => handleInternalAnchorClick(event, item.href, onNavigate)}
    >
      {item.label}
    </Link>
  );
}

export function Header({ variant, siteConfig }: HeaderProps) {
  const pathname = usePathname() ?? "/";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const resolvedVariant = variant ?? (pathname.startsWith("/photography") ? "photography" : "default");
  const navItems = resolvedVariant === "photography" ? photographyNav : mainNav;
  const activeHash = useActiveSection(navItems, pathname);

  const isActive = (item: NavItem) => {
    if (isExternal(item)) return false;
    const [path, hash] = item.href.split("#");
    if (hash) return pathname === (path || "/") && activeHash === `#${hash}`;
    return pathname === item.href;
  };

  // Native <dialog>: focus trap, Esc to close and inert background come for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  // Initial load with a hash: re-align after fonts/layout settle.
  useEffect(() => {
    if (!window.location.hash) return;
    const timeout = window.setTimeout(() => {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({ block: "start" });
    }, 80);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <header
      data-site-header
      className="sticky top-0 z-50 h-[var(--header-height)] border-b border-line bg-bg"
    >
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="display flex min-h-11 shrink-0 items-center text-xl text-ink"
        >
          ZK.<span className="sr-only"> {siteConfig.name}, home</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavAnchor
                  item={item}
                  active={isActive(item)}
                  className={cn(
                    "label inline-flex min-h-11 items-center gap-1 rounded-full px-3.5 transition-colors duration-150",
                    isActive(item) ? "bg-ink text-bg" : "text-ink hover:bg-surface-2",
                  )}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <div className="hidden lg:block">
            <Link
              href="/#contact"
              onClick={(event) => handleInternalAnchorClick(event, "/#contact")}
              className={buttonClass("primary")}
            >
              Contact
            </Link>
          </div>
          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-ink hover:text-bg lg:hidden"
          >
            <Menu aria-hidden className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-ink backdrop:bg-bg"
      >
        <div className="flex min-h-full flex-col border border-line">
          <div className="flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-line px-4 sm:px-6">
            <span className="display text-xl">ZK.</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line hover:bg-ink hover:text-bg"
            >
              <X aria-hidden className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 px-4 py-6 sm:px-6">
            <ol className="grid">
              {navItems.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <NavAnchor
                    item={item}
                    active={isActive(item)}
                    onNavigate={() => setOpen(false)}
                    className="display flex min-h-16 items-center gap-3 py-3 text-[clamp(1.75rem,8vw,2.75rem)] text-ink hover:text-primary aria-[current]:text-primary"
                  />
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-4 sm:px-6">
            <ThemeToggle />
            <a href={`mailto:${siteConfig.email}`} className={buttonClass("primary")}>
              Email
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
