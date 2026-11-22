"use client";

import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

/**
 * Icon and label swap through `dark:` variants, so the server HTML is valid for
 * both themes. The switch itself grows as a circle from the button (View
 * Transitions); without the API, or under reduced motion, it switches instantly.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduced) {
      setTheme(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const root = document.documentElement.style;
    root.setProperty("--vt-x", `${x}px`);
    root.setProperty("--vt-y", `${y}px`);
    root.setProperty(
      "--vt-r",
      `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`,
    );

    // next-themes applies the class in an effect, so set it directly too: the
    // "new" snapshot must already show the new theme.
    document.startViewTransition(() => {
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.style.colorScheme = next;
      flushSync(() => setTheme(next));
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Dark theme, currently ${isDark ? "Dark" : "Light"}`}
      aria-pressed={isDark}
      suppressHydrationWarning
      className={cn(
        "label inline-flex min-h-11 cursor-pointer items-center gap-2 hover-fill rounded-full border border-line px-4 text-ink",
        className,
      )}
    >
      <Sun aria-hidden className="h-4 w-4 dark:hidden" strokeWidth={1.75} />
      <Moon aria-hidden className="hidden h-4 w-4 dark:block" strokeWidth={1.75} />
      <span className="dark:hidden">Light</span>
      <span className="hidden dark:inline">Dark</span>
    </button>
  );
}
