"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { contactNavItem, mainNav, photographyNav } from "@/data/navigation";
import type { SiteConfig } from "@/types/site";
import type { NavItem } from "@/types";
import { cn } from "@/lib/cn";
import { lockScroll, scrollToTarget } from "@/lib/smooth-scroll";
import { buttonClass } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
  variant?: "default" | "photography";
  siteConfig: SiteConfig;
}

const isExternal = (item: NavItem) => item.external || item.href.startsWith("http");

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

/** Below lg the header slides away while scrolling down and returns on scroll up. */
function useHideOnScroll(pinned: boolean) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (pinned) {
      setHidden(false);
      return;
    }

    const narrow = window.matchMedia("(max-width: 1023px)");
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (!narrow.matches || y < 120) setHidden(false);
      else if (delta > 8) setHidden(true);
      else if (delta < -8) setHidden(false);
      if (Math.abs(delta) > 8) lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pinned]);

  return [hidden, setHidden] as const;
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
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  );
}

export function Header({ variant, siteConfig }: HeaderProps) {
  const pathname = usePathname() ?? "/";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null);
  const [hidden, setHidden] = useHideOnScroll(open);

  const resolvedVariant = variant ?? (pathname.startsWith("/photography") ? "photography" : "default");
  const navItems = resolvedVariant === "photography" ? photographyNav : mainNav;
  const activeHash = useActiveSection(navItems, pathname);

  const isActive = (item: NavItem) => {
    if (isExternal(item)) return false;
    const [path, hash] = item.href.split("#");
    if (hash) return pathname === (path || "/") && activeHash === `#${hash}`;
    return pathname === item.href;
  };

  const activeIndex = navItems.findIndex(isActive);

  // One ink pill slides to the active link instead of each link toggling a fill.
  useLayoutEffect(() => {
    const measure = () => {
      const link = navRef.current?.querySelectorAll<HTMLElement>("[data-nav-link]")[activeIndex];
      setIndicator(link ? { x: link.offsetLeft, width: link.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  // Native <dialog>: focus trap, Esc to close and inert background come for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  // Initial load with a hash: re-align after fonts/layout settle.
  useEffect(() => {
    if (!window.location.hash) return;
    const timeout = window.setTimeout(() => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) scrollToTarget(target);
    }, 80);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <header
      data-site-header
      data-hidden={hidden}
      onFocusCapture={() => setHidden(false)}
      className="sticky top-0 z-50 h-[var(--header-height)] border-b border-line bg-bg"
    >
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="display flex min-h-11 shrink-0 items-center text-xl text-ink">
          ZK.<span className="sr-only"> {siteConfig.name}, home</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul ref={navRef} className="relative flex items-center gap-1">
            {indicator ? (
              <li
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 rounded-none bg-ink transition-[transform,width] duration-200 ease-out"
                style={{ width: indicator.width, transform: `translateX(${indicator.x}px)` }}
              />
            ) : null}
            {navItems.map((item) => (
              <li key={item.href} data-nav-link className="relative">
                <NavAnchor
                  item={item}
                  active={isActive(item)}
                  className={cn(
                    "label inline-flex min-h-11 items-center gap-1 rounded-none px-3.5 text-sm transition-colors duration-200",
                    isActive(item) ? "hover-fill text-bg" : "hover-fill text-ink",
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
            <Link href="/#contact" className={buttonClass("primary")}>
              Contact
            </Link>
          </div>
          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center hover-fill rounded-none border border-line text-ink lg:hidden"
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
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center hover-fill rounded-none border border-line"
            >
              <X aria-hidden className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 px-4 py-6 sm:px-6">
            <ol className="grid">
              {[...navItems, contactNavItem].map((item, index) => (
                <li key={item.href} className="enter border-b border-line" style={{ "--i": index } as React.CSSProperties}>
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
