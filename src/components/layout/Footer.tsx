import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { identity } from "@/lib/identity";
import { footerNav } from "@/data/navigation";
import { socialGroups } from "@/data/social";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { SiteConfig } from "@/types/site";

interface FooterProps {
  siteConfig: SiteConfig;
}

const linkClass =
  "inline-flex min-h-11 items-center gap-1 text-sm text-ink underline-offset-4 hover:text-primary hover:underline";

export function Footer({ siteConfig }: FooterProps) {
  return (
    <footer className="border-t border-line bg-bg" data-no-print>
      <div className="grid gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
        <div className="min-w-0 lg:col-span-6">
          <Link href="/" className="display text-[clamp(2.5rem,8vw,4.5rem)] text-ink">
            ZK.
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">{identity.metaDescription}</p>
          <SocialLinks links={socialGroups.personal} size="sm" className="mt-6" />
        </div>

        <nav aria-label="Footer" className="min-w-0 lg:col-span-6">
          <p className="label text-ink-muted">Index</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 border-t border-line pt-2 sm:grid-cols-3">
            {footerNav.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {item.label}
                    <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link href="/photography" className={linkClass}>
                Photography
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex flex-col gap-3 border-t border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="label text-ink-muted" suppressHydrationWarning>
          © {new Date().getFullYear()} {siteConfig.name} · {identity.location.label}
        </p>
        <ThemeToggle />
      </div>
    </footer>
  );
}
