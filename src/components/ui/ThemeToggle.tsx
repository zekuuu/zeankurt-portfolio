"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

/**
 * Icon and label swap through `dark:` variants, so the server HTML is valid for
 * both themes and there is no hydration mismatch or mount flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Dark theme, currently ${isDark ? "Dark" : "Light"}`}
      aria-pressed={isDark}
      suppressHydrationWarning
      className={cn(
        "label inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-ink transition-colors duration-150 hover:bg-ink hover:text-bg",
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
