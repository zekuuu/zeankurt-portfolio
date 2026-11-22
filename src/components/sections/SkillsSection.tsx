import { Badge } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SkillCategory } from "@/types";

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
          {categories.map((category) => (
            <div
              key={category.name}
              className="grid gap-3 border-t border-line py-5 md:grid-cols-[minmax(12rem,1fr)_3fr] md:gap-8"
            >
              <dt className="flex items-baseline justify-between gap-3 md:block">
                <span className="display block text-xl [overflow-wrap:anywhere]">{category.name}</span>
                <span className="label text-ink-muted md:mt-1 md:block">
                  {category.skills.length} {category.skills.length === 1 ? "tool" : "tools"}
                </span>
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <li key={skill}>
                      <Badge>{skill}</Badge>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
