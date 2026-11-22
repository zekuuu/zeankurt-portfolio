import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { StackLogo } from "@/lib/stack-icons";

/**
 * CSS-only logo ticker. Logos sit in muted ink and take their brand color on
 * hover. The first copy is readable; the duplicate that makes the loop seamless
 * is hidden from assistive tech. Pauses on hover/focus; static under reduced motion.
 */
export function Marquee({ items, label, className }: { items: StackLogo[]; label: string; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-2 pr-2">
      {items.map((item) => (
        <li
          key={item.label}
          data-dark-brand={item.darkBrand || undefined}
          style={item.hex ? ({ "--brand": item.hex } as CSSProperties) : undefined}
          className="logo-chip flex items-center gap-2.5 whitespace-nowrap rounded-full px-3 py-2"
        >
          {item.path ? (
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-current">
              <path d={item.path} />
            </svg>
          ) : null}
          <span className="font-mono text-sm text-ink">{item.label}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn("marquee select-none overflow-hidden [-webkit-user-drag:none] [&_*]:[-webkit-user-drag:none]", className)}
      aria-label={label}
      role="region"
    >
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
