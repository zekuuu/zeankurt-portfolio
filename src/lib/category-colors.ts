import type { BadgeVariant } from "@/components/ui/Badge";

/**
 * One color per experience type / event category, shared by the home page
 * timeline and /events so the same word always has the same color.
 */
const CATEGORY_BADGE: Record<string, BadgeVariant> = {
  work: "primary",
  conference: "primary",
  community: "green",
  meetup: "green",
  hackathon: "yellow",
  workshop: "orange",
};

/** Timeline dot fill for each badge color. */
const DOT: Partial<Record<BadgeVariant, string>> = {
  primary: "bg-primary border-primary",
  green: "bg-block-green border-line",
  yellow: "bg-block-yellow border-line",
  orange: "bg-block-orange border-line",
};

export function categoryBadge(category?: string | null): BadgeVariant {
  return (category && CATEGORY_BADGE[category.toLowerCase()]) || "default";
}

export function categoryDot(category?: string | null) {
  return DOT[categoryBadge(category)] ?? "border-line bg-surface";
}
