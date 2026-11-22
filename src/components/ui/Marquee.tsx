import { cn } from "@/lib/cn";

/**
 * CSS-only ticker. The first copy is readable; the duplicate that makes the loop
 * seamless is hidden from assistive tech. Pauses on hover/focus and is static
 * under reduced motion.
 */
export function Marquee({ items, label, className }: { items: readonly string[]; label: string; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="label flex items-center whitespace-nowrap">
          <span className="px-4">{item}</span>
          <span aria-hidden>✱</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("marquee overflow-hidden", className)} aria-label={label} role="region">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
