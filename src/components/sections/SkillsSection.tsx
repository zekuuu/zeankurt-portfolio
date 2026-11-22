import { Badge } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tile } from "@/components/ui/Tile";
import type { SkillCategory } from "@/types";

interface SkillsSectionProps {
  skillCategories: SkillCategory[];
}

export function SkillsSection({ skillCategories }: SkillsSectionProps) {
  const categories = skillCategories.filter((category) => category.skills.length > 0);

  return (
    <Section id="skills" aria-labelledby="skills-title">
      <Container>
        <SectionHeading
          id="skills-title"
          index="03"
          eyebrow="Skills"
          title="Tools I build with."
          description="Full-stack development for websites and software products, shaped by hackathons, client work and hands-on builds."
        />

        <div className="mt-10 grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <Tile key={category.name} className="flex flex-col">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="display text-xl [overflow-wrap:anywhere]">{category.name}</h3>
                <span className="label shrink-0 text-ink-muted">
                  {String(index + 1).padStart(2, "0")} · {category.skills.length}
                </span>
              </div>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <li key={skill}>
                    <Badge>{skill}</Badge>
                  </li>
                ))}
              </ul>
            </Tile>
          ))}
        </div>
      </Container>
    </Section>
  );
}
