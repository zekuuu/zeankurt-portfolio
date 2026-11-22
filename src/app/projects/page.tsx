import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tile, tileVariantAt } from "@/components/ui/Tile";
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
      <Container className="py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="label text-ink-muted">
          <Link href="/" className="inline-flex min-h-11 items-center hover:text-primary">
            Home
          </Link>{" "}
          / <span className="text-ink">Projects</span>
        </nav>

        <SectionHeading
          as="h1"
          eyebrow="Projects"
          title={`Projects by ${identity.name}`}
          description={`${projects.length} web apps, Web3 builds, templates and tools.`}
          className="mt-6"
        />

        <ul className="mt-10 grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <li key={project.slug} className="flex">
              <Tile variant={tileVariantAt(index)} interactive className="flex w-full flex-col">
                <p className="label opacity-80">
                  {project.year} · {project.role}
                </p>
                <h2 className="display mt-4 text-2xl [overflow-wrap:anywhere]">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="after:absolute after:inset-0 after:rounded-tile after:content-['']"
                  >
                    {project.title}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed">{project.description}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {[...projectBadges(project), ...project.tags].map((tag) => (
                    <li key={tag}>
                      <Badge>{tag}</Badge>
                    </li>
                  ))}
                </ul>
              </Tile>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
