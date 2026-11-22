// TEMPORARY style guide (Phase 1). noindex, not in sitemap. Delete in Phase 6.
import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Tile, type TileVariant } from "@/components/ui/Tile";

export const metadata: Metadata = { title: "Design system", robots: { index: false, follow: false } };

const variants: TileVariant[] = ["surface", "muted", "primary", "yellow", "orange", "green", "outline"];
const swatches = ["bg", "surface", "surface-2", "ink", "ink-muted", "line", "primary", "block-yellow", "block-orange", "block-green"];

export default function DesignSystemPage() {
  return (
    <main id="main-content">
      <Section className="border-t-0">
        <Container>
          <SectionHeading as="h1" index="00" eyebrow="Design system" title="Tokens and primitives" action={<ThemeToggle />} />

          <div className="mt-10 grid grid-cols-2 gap-[var(--gap)] sm:grid-cols-5">
            {swatches.map((name) => (
              <div key={name} className="rounded-tile border border-line bg-surface p-3">
                <div className="h-12 rounded-[10px] border border-line" style={{ background: `var(--${name})` }} />
                <p className="label mt-2 text-ink-muted">--{name}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-[var(--gap)] sm:grid-cols-2 lg:grid-cols-4">
            {variants.map((variant, i) => (
              <Tile key={variant} variant={variant} interactive className="min-h-40">
                <p className="label">0{i + 1} / {variant}</p>
                <p className="display mt-4 text-2xl">Tile {variant}</p>
                <p className="mt-2 text-sm">Body copy on this fill.</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <Badge>Next.js</Badge>
                  <Badge>Supabase</Badge>
                </div>
              </Tile>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="#">View projects <ArrowUpRight className="h-4 w-4" /></Button>
            <Button variant="secondary" href="#"><Mail className="h-4 w-4" /> Email</Button>
            <Button variant="ghost">Ghost</Button>
            <Badge variant="live">Live</Badge>
            <Badge variant="wip">WIP</Badge>
            <Badge variant="archived">Archived</Badge>
            <Badge variant="solid">Solid</Badge>
          </div>

          <div className="mt-10 grid gap-2">
            <p className="display text-[clamp(2.5rem,8vw,6.5rem)]">Display H1</p>
            <p className="display text-4xl">Display H2</p>
            <p className="max-w-prose text-lg">Geist body, 18px, line-height 1.6. The quick brown fox jumps over the lazy dog.</p>
            <p className="label text-ink-muted">01 / Geist Mono label</p>
            <a href="#" className="text-primary underline underline-offset-4">Inline link</a>
          </div>
        </Container>
      </Section>
    </main>
  );
}
