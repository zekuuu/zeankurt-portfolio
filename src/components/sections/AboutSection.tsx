import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tile } from "@/components/ui/Tile";
import { identity } from "@/lib/identity";
import type { Certification, EventHighlight, Project, SkillCategory } from "@/types";

const EMPHASIS = [
  "full-stack web developer",
  "Next.js, React, TypeScript, Tailwind CSS, Laravel, Supabase and PostgreSQL",
  "WebX",
  "Best Pivot Award",
];

/** Renders bio copy verbatim, setting key phrases in medium weight. */
function withEmphasis(text: string) {
  const pattern = new RegExp(`(${EMPHASIS.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return text.split(pattern).map((part, index) =>
    EMPHASIS.includes(part) ? (
      <strong key={index} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

interface AboutSectionProps {
  projects: Project[];
  skillCategories: SkillCategory[];
  certifications: Certification[];
  eventHighlights: EventHighlight[];
  hackathonCount: number;
}

export function AboutSection({ projects, certifications, eventHighlights, hackathonCount }: AboutSectionProps) {
  const stats = [
    { label: "Projects", value: projects.length },
    { label: "Events", value: eventHighlights.length },
    { label: "Certifications", value: certifications.length },
    { label: "Hackathons", value: hackathonCount },
  ];
  const [first, ...rest] = identity.bios.long;

  return (
    <Section id="about" aria-labelledby="about-title" surface="subtle">
      <Container>
        <SectionHeading id="about-title" index="02" eyebrow="About" title="Building full-stack web products." />

        <div className="mt-10 grid gap-1.5 lg:grid-cols-12">
          <Tile className="lg:col-span-7 lg:row-span-2 lg:p-10">
            <p data-about-para className="text-lg leading-relaxed text-ink-muted sm:text-xl">
              {withEmphasis(first)}
            </p>
          </Tile>
          {rest.map((paragraph) => (
            <Tile key={paragraph.slice(0, 24)} className="lg:col-span-5">
              <p data-about-para className="leading-relaxed text-ink-muted">
                {withEmphasis(paragraph)}
              </p>
            </Tile>
          ))}
        </div>

        <dl className="mt-1.5 grid grid-cols-2 gap-1.5 lg:grid-cols-4">
          {stats.map((stat) => (
            <Tile key={stat.label} variant="outline" className="flex flex-col-reverse">
              <dt className="label mt-2 text-ink-muted">{stat.label}</dt>
              <dd className="display text-[clamp(2.25rem,5vw,3.5rem)]">{stat.value}</dd>
            </Tile>
          ))}
        </dl>

        <p className="label mt-4 text-ink-muted">
          {identity.education.degree} · {identity.education.school} ·{" "}
          {identity.credentials.map((c) => `${c.issuer} ${c.name}`).join(" · ")}
        </p>
      </Container>
    </Section>
  );
}
