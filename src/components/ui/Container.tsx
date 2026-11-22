import { forwardRef } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/** Horizontal gutter inside the page frame. */
export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn("relative w-full min-w-0 px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** `subtle` gives the section the surface-2 fill; kept name for API compatibility. */
  surface?: "default" | "subtle" | "elevated";
}

/** Frame section: full-width 1px rule on top, flat fill, generous vertical rhythm. */
export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className, surface = "default", ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        "relative border-t border-line py-12 sm:py-16 lg:py-24",
        surface === "subtle" ? "bg-surface-2" : "bg-bg",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  ),
);

Section.displayName = "Section";
