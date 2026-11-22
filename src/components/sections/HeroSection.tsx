import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { socialGroups } from "@/data/social";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Tile } from "@/components/ui/Tile";
import { identity } from "@/lib/identity";
import type { Project } from "@/types";

interface HeroSectionProps {
  email: string;
  featured?: Project;
}

/** Server-rendered: every word of the hero is in the HTML, no JS involved. */
export function HeroSection({ email, featured }: HeroSectionProps) {
  return (
    <section aria-labelledby="hero-name" className="grid gap-1.5 p-1.5 lg:grid-cols-12">
      <Tile className="flex flex-col justify-between gap-10 lg:col-span-8 lg:min-h-[34rem] lg:p-10">
        <p className="label text-ink-muted">
          {identity.jobTitles[0]} · {identity.location.label}
        </p>

        <div>
          <h1
            id="hero-name"
            className="display text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.03em] [overflow-wrap:anywhere]"
          >
            {identity.name}
          </h1>
          <p className="mt-4 text-lg font-medium sm:text-xl">{identity.role}</p>
          <p className="mt-3 max-w-[58ch] leading-relaxed text-ink-muted">{identity.heroCopy}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button href="/#projects">
            View projects <ArrowUpRight aria-hidden className="h-4 w-4" />
          </Button>
          <Button href={`mailto:${email}`} variant="secondary">
            <Mail aria-hidden className="h-4 w-4" /> Email
          </Button>
          <SocialLinks links={socialGroups.personal} className="sm:ml-auto" />
        </div>
      </Tile>

      <div className="grid gap-1.5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
        <Tile variant="yellow" className="flex flex-col">
          <p className="label">Status</p>
          <p className="display mt-3 text-2xl">Open to</p>
          <ul className="mt-3 grid gap-1.5 text-sm font-medium">
            {identity.lookingFor.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden>→</span>
                {item}
              </li>
            ))}
          </ul>
        </Tile>

        {featured ? (
          <Tile variant="primary" interactive className="flex flex-col">
            <p className="label">Featured project</p>
            <h2
              className={`display mt-3 [overflow-wrap:anywhere] ${
                featured.title.length > 24 ? "text-2xl leading-tight" : "text-[clamp(1.75rem,3vw,2.25rem)]"
              }`}
            >
              <Link
                href={`/projects/${featured.slug}`}
                className="after:absolute after:inset-0 after:rounded-tile after:content-['']"
              >
                {featured.title}
              </Link>
            </h2>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed">{featured.description}</p>
            <span aria-hidden className="label mt-auto inline-flex items-center gap-1 pt-4">
              Case study <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Tile>
        ) : null}
      </div>

      <Tile variant="muted" className="px-0 py-4 sm:px-0 sm:py-4 lg:col-span-12">
        <Marquee items={identity.stack} label="Tech stack" />
      </Tile>
    </section>
  );
}
