import { cn } from "@/lib/cn";

export type BadgeVariant = "default" | "solid" | "live" | "wip" | "archived" | "primary" | "yellow" | "green" | "orange";

const variants: Record<BadgeVariant, string> = {
  default: "border-current",
  solid: "border-ink bg-ink text-bg",
  // Ink border keeps a status badge visible on a tile of the same color.
  live: "border-on-block bg-block-green text-on-block",
  wip: "border-on-block bg-block-yellow text-on-block",
  archived: "border-line bg-surface-2 text-ink",
  // Category colors (experience types).
  primary: "border-transparent bg-primary text-on-primary",
  yellow: "border-on-block bg-block-yellow text-on-block",
  green: "border-on-block bg-block-green text-on-block",
  orange: "border-on-block bg-block-orange text-on-block",
};

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: BadgeVariant;
}

/** Pill tag in Geist Mono. Inherits text color by default, so it works on any tile. */
export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full border px-2.5 py-1 font-mono text-xs font-medium leading-none [overflow-wrap:anywhere]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function statusBadgeVariant(status?: string): BadgeVariant {
  if (status === "live" || status === "wip" || status === "archived") return status;
  return "default";
}
