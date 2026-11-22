import Link from "next/link";
import { cn } from "@/lib/cn";

/** `inverse` sits on a primary-colored tile. */
type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary: "border-primary bg-primary text-on-primary hover:bg-ink hover:border-ink hover:text-bg",
  secondary: "border-line bg-transparent text-ink hover:bg-ink hover:text-bg",
  ghost: "border-transparent bg-transparent text-ink hover:border-line",
  inverse: "border-on-primary bg-transparent text-on-primary hover:bg-on-primary hover:text-primary",
};

export const buttonClass = (variant: ButtonVariant = "primary", className?: string) =>
  cn(
    "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors duration-150",
    variants[variant],
    className,
  );

/** Pill button. Renders a link when `href` is set; external links open in a new tab. */
export function Button({
  children,
  href,
  external,
  variant = "primary",
  className,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = buttonClass(variant, className);

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
