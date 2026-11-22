import { Badge } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { brandLogo } from "@/lib/stack-icons";
import type { SkillCategory } from "@/types";

/** Swatch color per category, cycling; the row hover color is random (HoverColor). */
const ROW_COLORS = [
  { swatch: "bg-primary" },
  { swatch: "bg-block-yellow" },
  { swatch: "bg-block-orange" },
  { swatch: "bg-block-green" },
];

interface SkillsSectionProps {
  skillCategories: SkillCategory[];
}

/** Ruled list instead of tiles, so this section reads differently from its neighbours. */
export function SkillsSection({ skillCategories }: SkillsSectionProps) {
  const categories = skillCategories.filter((category) => category.skills.length > 0);

  return (
    <Section id="skills" aria-labelledby="skills-title">
      <Container>
        <SectionHeading
          id="skills-title"
          eyebrow="Skills"
          title="Tools I build with."
          description="Full-stack development for websites and software products, shaped by hackathons, client work and hands-on builds."
        />

        <dl className="mt-10 border-b border-line">
          {categories.map((category, index) => {
            const color = ROW_COLORS[index % ROW_COLORS.length];
            return (
            <div
              key={category.name}
              className={`group grid gap-3 border-t border-line px-3 py-5 md:grid-cols-[minmax(12rem,1fr)_3fr] md:gap-8 hover-fill`}
            >
              <dt className="flex items-baseline justify-between gap-3 md:block">
                <span className="display flex items-center gap-3 text-xl [overflow-wrap:anywhere]">
                  <span aria-hidden className={`inline-block h-3.5 w-3.5 shrink-0 rounded-[4px] border border-line group-hover:border-current ${color.swatch}`} />
                  {category.name}
                </span>
                <span className="label text-ink-muted group-hover:text-inherit md:mt-1 md:block">
                  {category.skills.length} {category.skills.length === 1 ? "tool" : "tools"}
                </span>
              </dt>
              <dd>
                <ul className="flex flex-wrap items-center gap-1.5">
                  {category.skills.map((skill) => {
                    const logo = brandLogo(skill);
                    return (
                      <li key={skill} className="flex">
                        <Badge className="h-7 gap-1.5">
                          {logo.path ? (
                            <svg
                              aria-hidden
                              viewBox="0 0 24 24"
                              data-dark-brand={logo.darkBrand || undefined}
                              style={{ "--brand": logo.hex } as React.CSSProperties}
                              className="h-3.5 w-3.5 shrink-0 fill-current text-(--brand) transition-colors duration-200 group-hover:text-inherit dark:data-[dark-brand]:text-ink dark:group-hover:data-[dark-brand]:text-inherit"
                            >
                              <path d={logo.path} />
                            </svg>
                          ) : null}
                          {skill}
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
            );
          })}
        </dl>
      </Container>
    </Section>
  );
}
