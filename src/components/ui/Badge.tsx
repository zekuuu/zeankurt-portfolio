import { cn } from "@/lib/cn";

export type BadgeVariant = "default" | "solid" | "live" | "wip" | "archived";

const variants: Record<BadgeVariant, string> = {
  default: "border-current",
  solid: "border-ink bg-ink text-bg",
  live: "border-transparent bg-block-green text-on-block",
  wip: "border-transparent bg-block-yellow text-on-block",
  archived: "border-transparent bg-surface-2 text-ink",
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
        "inline-flex max-w-full items-center rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] font-medium uppercase leading-none tracking-[0.08em] [overflow-wrap:anywhere]",
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
