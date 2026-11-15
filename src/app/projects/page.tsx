import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPortfolioContent } from "@/lib/cms/queries";
import { identity } from "@/lib/identity";
import { projectBadges } from "@/lib/project-meta";
import { JsonLdScript, projectsIndexGraph } from "@/lib/structured-data";

export const revalidate = 60;
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Projects",
  description: `Web apps, Web3 builds and tools by ${identity.name}: full-stack projects built with Next.js, React, TypeScript, Supabase and Laravel.`,
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects" },
};

export default async function ProjectsPage() {
  const { projects } = await getPortfolioContent();

  return (
    <main id="main-content">
      <JsonLdScript data={projectsIndexGraph(projects)} />
      <Section className="pt-28 sm:pt-32">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--foreground-muted)]">
            <Link href="/" className="hover:text-white">
              Home
            </Link>{" "}
            / <span>Projects</span>
          </nav>

          <SectionHeading
            as="h1"
            eyebrow="Projects"
            title={
              <>
                Projects by <span className="emphasis-glow-blue">{identity.name}</span>
              </>
            }
            description={`${projects.length} web apps, Web3 builds, templates and tools.`}
          />

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <li
                key={project.slug}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-5 transition hover:border-[var(--border-strong)]"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--blue-400)]">
                  {project.year} · {project.role}
                </p>
                <h2 className="mt-1.5 font-[family-name:var(--font-syne)] text-lg font-semibold leading-snug text-white">
                  <Link href={`/projects/${project.slug}`} className="hover:text-[var(--blue-200)]">
                    {project.title}
                  </Link>
                </h2>
                <p className="mt-2 flex-1 text-sm leading-7 text-[var(--foreground)]/80">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[...projectBadges(project), ...project.tags].map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </main>
  );
}
