import type { SocialLink } from "@/types";
import { cn } from "@/lib/cn";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
  iconClassName?: string;
  showLabels?: boolean;
  size?: "sm" | "md";
}

export function SocialLinks({ links, className, iconClassName, showLabels = false }: SocialLinksProps) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map((link) => (
        <li key={link.id}>
          <SocialLinkButton link={link} showLabels={showLabels} iconClassName={iconClassName} />
        </li>
      ))}
    </ul>
  );
}

interface SocialLinkGroupsProps {
  personal: SocialLink[];
  photography: SocialLink[];
  affiliation: SocialLink[];
}

export function SocialLinkGroups({ personal, photography, affiliation }: SocialLinkGroupsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {[
        ["Personal", personal],
        ["Photography", photography],
        ["Studio Nomads", affiliation],
      ].map(([title, links]) => (
        <div key={title as string} className="min-w-0">
          <h3 className="label text-ink-muted">{title as string}</h3>
          <SocialLinks links={links as SocialLink[]} showLabels className="mt-3" />
        </div>
      ))}
    </div>
  );
}

function SocialLinkButton({
  link,
  showLabels,
  iconClassName,
}: {
  link: SocialLink;
  showLabels: boolean;
  iconClassName?: string;
}) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={showLabels ? undefined : `${link.label} (opens in a new tab)`}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 hover-fill rounded-none border border-current",
        showLabels ? "px-4 text-sm font-medium" : "w-11",
      )}
    >
      <SocialIcon platform={link.platform} className={cn("h-4 w-4 shrink-0", iconClassName)} />
      {showLabels ? <span className="truncate">{link.label}</span> : null}
    </a>
  );
}
