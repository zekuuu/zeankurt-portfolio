import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TileVariant =
  | "surface"
  | "muted"
  | "primary"
  | "yellow"
  | "orange"
  | "green"
  | "outline";

export const tileVariants: Record<TileVariant, string> = {
  surface: "bg-surface text-ink border border-line",
  muted: "bg-surface-2 text-ink border border-transparent",
  primary: "bg-primary text-on-primary border border-transparent",
  yellow: "bg-block-yellow text-on-block border border-transparent",
  orange: "bg-block-orange text-on-block border border-transparent",
  green: "bg-block-green text-on-block border border-transparent",
  outline: "bg-transparent text-ink border border-line",
};

/**
 * Rotating block colors for project cards (owner choice: the multi-color cards
 * are part of the site's identity). Index-based, so stable across builds.
 */
const ROTATION: TileVariant[] = ["primary", "yellow", "surface", "orange", "green", "surface"];

export function tileVariantAt(index: number): TileVariant {
  return ROTATION[index % ROTATION.length];
}

interface TileProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TileVariant;
  interactive?: boolean;
  children?: ReactNode;
}

/** Rounded bento tile: one flat fill, 1px border on neutral variants, no shadow. */
export function Tile({
  as: Component = "div",
  variant = "surface",
  interactive = false,
  className,
  children,
  ...props
}: TileProps) {
  return (
    <Component
      data-tile=""
      className={cn(
        "relative min-w-0 rounded-tile p-5 sm:p-6",
        tileVariants[variant],
        interactive &&
          "transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-within:-translate-y-0.5 motion-reduce:transform-none",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
