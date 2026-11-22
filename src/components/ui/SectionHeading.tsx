import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  /** Kept for API compatibility; headings are always flush-left. */
  centered?: boolean;
  as?: "h1" | "h2";
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  titleClassName,
  descriptionClassName,
  as: Heading = "h2",
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn("grid min-w-0 gap-4 lg:grid-cols-12 lg:items-end lg:gap-6", className)}>
      <div className="min-w-0 lg:col-span-8">
        {eyebrow ? <p className="label text-ink-muted">{eyebrow}</p> : null}

        <Heading
          id={id}
          className={cn(
            "display mt-3 max-w-[22ch] text-[clamp(1.875rem,5vw,3.5rem)] text-ink [overflow-wrap:anywhere]",
            titleClassName,
          )}
        >
          {title}
        </Heading>
      </div>

      {description || action ? (
        <div className="min-w-0 lg:col-span-4">
          {description ? (
            <p
              className={cn(
                "max-w-[52ch] text-base leading-relaxed text-ink-muted",
                descriptionClassName,
              )}
            >
              {description}
            </p>
          ) : null}
          {action ? <div className={description ? "mt-4" : undefined}>{action}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
