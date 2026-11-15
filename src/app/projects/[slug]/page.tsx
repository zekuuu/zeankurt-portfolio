import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
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

const LABEL = "font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--blue-400)]";

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const { project, next } = await findProject(slug);
  if (!project) notFound();

  const badges = projectBadges(project);

  return (
    <main id="main-content">
      <JsonLdScript data={projectGraph(project)} />
      <Section className="pt-28 sm:pt-32">
        <Container className="max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--foreground-muted)]">
            <Link href="/" className="hover:text-white">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/projects" className="hover:text-white">
              Projects
            </Link>{" "}
            / <span>{project.title}</span>
          </nav>

          <article>
            <p className={LABEL}>
              {project.year} · {project.role}
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-syne)] text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
              {project.title}
            </h1>

            {badges.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge key={badge}>{badge}</Badge>
                ))}
              </div>
            ) : null}

            {project.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                className="mt-8 w-full rounded-2xl border border-[var(--border)] object-cover"
              />
            ) : null}

            <p className="mt-8 text-lg leading-8 text-white">{project.description}</p>
            {project.longDescription ? (
              <p className="mt-4 text-base leading-8 text-[var(--foreground)]/80">
                {project.longDescription}
              </p>
            ) : null}

            <dl className="mt-8 grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-5 sm:grid-cols-3">
              <div>
                <dt className={LABEL}>Role</dt>
                <dd className="mt-1 text-sm text-white">{project.role}</dd>
              </div>
              <div>
                <dt className={LABEL}>Year</dt>
                <dd className="mt-1 text-sm text-white">{project.year}</dd>
              </div>
              <div>
                <dt className={LABEL}>Built by</dt>
                <dd className="mt-1 text-sm text-white">
                  <Link href="/" className="hover:text-[var(--blue-200)]">
                    {identity.name}
                  </Link>
                </dd>
              </div>
            </dl>

            <h2 className="mt-8 font-[family-name:var(--font-syne)] text-xl font-semibold text-white">
              Stack
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>

            {project.githubUrl || project.liveUrl ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-[var(--blue-950)]"
                  >
                    View live <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[var(--border-strong)] px-5 text-sm font-medium text-white hover:border-[var(--blue-400)]"
                  >
                    {isTeamRepo(project) ? "Team repository" : "Source on GitHub"}{" "}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </article>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-sm">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-[var(--foreground-muted)] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> All projects
            </Link>
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="inline-flex items-center gap-1.5 text-[var(--blue-300)] hover:text-white"
              >
                Next: {next.title} <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </Container>
      </Section>
    </main>
  );
}
