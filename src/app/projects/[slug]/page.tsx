import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Tile } from "@/components/ui/Tile";
import { getPortfolioContent } from "@/lib/cms/queries";
import { identity } from "@/lib/identity";
import { isTeamRepo, projectBadges } from "@/lib/project-meta";
import { JsonLdScript, projectGraph } from "@/lib/structured-data";

export const revalidate = 60;
export const dynamic = "force-static";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

async function findProject(slug: string) {
  const { projects } = await getPortfolioContent();
  const index = projects.findIndex((project) => project.slug === slug);

  return {
    project: index >= 0 ? projects[index] : undefined,
    next: index >= 0 && projects.length > 1 ? projects[(index + 1) % projects.length] : undefined,
    prev:
      index >= 0 && projects.length > 2
        ? projects[(index - 1 + projects.length) % projects.length]
        : undefined,
  };
}

export async function generateStaticParams() {
  const { projects } = await getPortfolioContent();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await findProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };

  const description = `${project.description} ${project.role}, ${project.year}. By ${identity.name}.`;

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title: project.title,
      description,
    },
    twitter: { title: project.title, description },
  };
}

const BADGE_VARIANT: Record<string, BadgeVariant> = {
  Shipped: "live",
  "In progress": "wip",
  Archived: "archived",
};

const neighbourClass =
  "rounded-tile border border-line p-5 transition-colors hover:bg-ink hover:text-bg";

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const { project, next, prev } = await findProject(slug);
  if (!project) notFound();

  const badges = projectBadges(project);

  return (
    <main id="main-content">
      <JsonLdScript data={projectGraph(project)} />
      <Container className="py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="label text-ink-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/projects" className="inline-flex min-h-11 items-center hover:text-primary">
                Projects
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink [overflow-wrap:anywhere]">
              {project.title}
            </li>
          </ol>
        </nav>

        <article className="mt-6">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="min-w-0 lg:col-span-8">
              <p className="label text-ink-muted">
                {project.year} · {project.role}
              </p>
              <h1
                className={`display mt-3 leading-[0.95] [overflow-wrap:anywhere] ${
                  project.title.length > 24 ? "text-[clamp(2rem,4.5vw,3.75rem)]" : "text-[clamp(2.25rem,7vw,5.5rem)]"
                }`}
              >
                {project.title}
              </h1>
            </div>
            {badges.length ? (
              <ul className="flex flex-wrap gap-1.5 lg:col-span-4 lg:justify-end">
                {badges.map((badge) => (
                  <li key={badge}>
                    <Badge variant={BADGE_VARIANT[badge] ?? "default"}>{badge}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          <div className="mt-8 grid gap-1.5 lg:grid-cols-12">
            {project.image ? (
              <Tile variant="muted" className="p-1.5 sm:p-1.5 lg:col-span-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  className="w-full rounded-[calc(var(--tile-radius)-6px)] border border-line object-cover"
                />
              </Tile>
            ) : null}

            <Tile className="lg:col-span-8 lg:p-10">
              <h2 className="label text-ink-muted">Overview</h2>
              <p className="mt-4 text-lg leading-relaxed sm:text-xl">{project.description}</p>
              {project.longDescription ? (
                <p className="mt-4 leading-relaxed text-ink-muted">{project.longDescription}</p>
              ) : null}
            </Tile>

            <div className="grid content-start gap-1.5 lg:col-span-4">
              <Tile variant="yellow">
                <dl className="grid gap-4">
                  <div>
                    <dt className="label">Role</dt>
                    <dd className="mt-1 font-medium">{project.role}</dd>
                  </div>
                  <div>
                    <dt className="label">Year</dt>
                    <dd className="mt-1 font-medium">{project.year}</dd>
                  </div>
                  <div>
                    <dt className="label">Built by</dt>
                    <dd className="mt-1 font-medium">
                      <Link href="/" className="underline underline-offset-4">
                        {identity.name}
                      </Link>
                    </dd>
                  </div>
                </dl>
              </Tile>

              <Tile>
                <h2 className="label text-ink-muted">Stack</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Badge>{tag}</Badge>
                    </li>
                  ))}
                </ul>
              </Tile>
            </div>
          </div>

          {project.githubUrl || project.liveUrl ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("primary")}>
                  View live <ArrowUpRight aria-hidden className="h-4 w-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary")}>
                  {isTeamRepo(project) ? "Team repository" : "Source on GitHub"}
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </article>

        <nav aria-label="More projects" className="mt-14 grid gap-1.5 border-t border-line pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className={neighbourClass}>
              <span className="label inline-flex items-center gap-1">
                <ArrowLeft aria-hidden className="h-3.5 w-3.5" /> Previous
              </span>
              <span className="display mt-2 block text-xl [overflow-wrap:anywhere]">{prev.title}</span>
            </Link>
          ) : (
            <Link href="/projects" className={neighbourClass}>
              <span className="label inline-flex items-center gap-1">
                <ArrowLeft aria-hidden className="h-3.5 w-3.5" /> Back
              </span>
              <span className="display mt-2 block text-xl">All projects</span>
            </Link>
          )}
          {next ? (
            <Link href={`/projects/${next.slug}`} className={`${neighbourClass} sm:text-right`}>
              <span className="label inline-flex items-center gap-1">
                Next <ArrowRight aria-hidden className="h-3.5 w-3.5" />
              </span>
              <span className="display mt-2 block text-xl [overflow-wrap:anywhere]">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </Container>
    </main>
  );
}
