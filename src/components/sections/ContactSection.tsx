import { Mail } from "lucide-react";
import { socialGroups } from "@/data/social";
import { Container, Section } from "@/components/ui/Container";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Tile } from "@/components/ui/Tile";
import { identity } from "@/lib/identity";

interface ContactSectionProps {
  siteConfig: {
    email: string;
  };
}

export function ContactSection({ siteConfig }: ContactSectionProps) {
  return (
    <Section id="contact" aria-labelledby="contact-title">
      <Container>
        <div className="grid gap-1.5 lg:grid-cols-12">
          <Tile variant="primary" className="flex flex-col gap-8 lg:col-span-8 lg:p-10">
            <p className="label">06 / Contact</p>
            <h2 id="contact-title" className="display max-w-[18ch] text-[clamp(2rem,5vw,4rem)]">
              Open to internships, client web projects, and collaborations.
            </h2>
            <p className="max-w-[56ch] leading-relaxed">
              Reach out for software engineering internships, client web projects through WebX, or hackathon teams.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-on-primary bg-on-primary px-5 text-sm font-medium text-primary transition-colors hover:bg-transparent hover:text-on-primary"
              >
                <Mail aria-hidden className="h-4 w-4" /> Email me
              </a>
              <CopyEmailButton email={siteConfig.email} variant="inverse" />
            </div>
          </Tile>

          <div className="grid gap-1.5 lg:col-span-4">
            <Tile className="flex flex-col">
              <p className="label text-ink-muted">Email</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-3 text-lg font-medium underline decoration-1 underline-offset-4 [overflow-wrap:anywhere] hover:text-primary"
              >
                {siteConfig.email}
              </a>
              <p className="label mt-auto pt-6 text-ink-muted">Based in {identity.location.label}</p>
            </Tile>
            <Tile variant="muted">
              <p className="label text-ink-muted">Elsewhere</p>
              <SocialLinks links={socialGroups.personal} showLabels className="mt-3" />
            </Tile>
          </div>
        </div>
      </Container>
    </Section>
  );
}
