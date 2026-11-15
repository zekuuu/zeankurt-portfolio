import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { getPortfolioContent } from "@/lib/cms/queries";
import { buildFaq } from "@/lib/faq";
import { isCreativeText, isMainPageEvent } from "@/lib/content-filters";
import { JsonLdScript, profilePageGraph } from "@/lib/structured-data";

export const revalidate = 60;
export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const content = await getPortfolioContent();
  const faq = buildFaq(content.siteConfig.email);

  // Photography lives on /photography; keep it out of the technical narrative.
  const experience = content.experience.filter(
    (item) => !isCreativeText(`${item.role} ${item.organization}`),
  );
  const skillCategories = content.skillCategories.filter(
    (category) => !isCreativeText(category.name),
  );
  const eventHighlights = content.eventHighlights.filter(isMainPageEvent);

  return (
    <main id="main-content">
      <JsonLdScript data={profilePageGraph(faq)} />

      <HeroSection />

      <ProjectsSection projects={content.projects} />

      <AboutSection
        projects={content.projects}
        certifications={content.certifications}
        eventHighlights={content.eventHighlights}
        skillCategories={skillCategories}
        hackathonCount={experience.filter((item) => item.type === "hackathon").length}
      />

      <SkillsSection skillCategories={skillCategories} />

      <ExperienceSection
        certifications={content.certifications}
        eventHighlights={eventHighlights}
        experience={experience}
      />

      <FaqSection items={faq} />

      <ContactSection siteConfig={content.siteConfig} />
    </main>
  );
}
