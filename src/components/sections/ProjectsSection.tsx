"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { Badge, statusBadgeVariant } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Listbox } from "@/components/ui/Listbox";
import { Tile, tileVariantAt } from "@/components/ui/Tile";
import { ZoomableImage } from "@/components/ui/ZoomableImage";
import { cn } from "@/lib/cn";

const INITIAL_SHOW = 6;
const ALL = "All";
const STATUS_LABEL: Record<NonNullable<Project["status"]>, string> = {
  live: "Live",
  wip: "WIP",
  archived: "Archived",
};

function ProjectLinks({ project }: { project: Project }) {
  const iconLink =
    "relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-current transition-colors hover:bg-ink hover:text-bg hover:border-ink";

  return (
    <div className="flex items-center gap-1.5">
      {project.githubUrl ? (
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub (opens in a new tab)`} className={iconLink}>
          <SocialIcon platform="github" className="h-4 w-4" />
        </a>
      ) : null}
      {project.liveUrl ? (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live site (opens in a new tab)`} className={iconLink}>
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}

function FeaturedTile({ project, index, wide }: { project: Project; index: number; wide: boolean }) {
  return (
    <Tile
      as="article"
      variant={tileVariantAt(index)}
      interactive
      className={cn("flex flex-col gap-4", wide && "md:col-span-2")}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="label opacity-80">{project.year}</p>
        {project.status ? <Badge variant={statusBadgeVariant(project.status)}>{STATUS_LABEL[project.status]}</Badge> : null}
      </div>

      {project.image ? (
        <div className={cn("relative overflow-hidden rounded-[10px] border border-current", wide ? "aspect-[16/8]" : "aspect-[16/10]")}>
          <ZoomableImage
            src={project.image}
            alt={`${project.title} screenshot`}
            sizes={wide ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            imageClassName="object-cover"
          />
        </div>
      ) : null}

      <div className="min-w-0">
        <h3 className={cn("display [overflow-wrap:anywhere]", wide ? "text-[clamp(1.75rem,4vw,3rem)]" : "text-2xl")}>
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:rounded-tile after:content-['']">
            {project.title}
          </Link>
        </h3>
        <p className="label mt-2 opacity-80">{project.role}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed">{project.description}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
        <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {project.tags.slice(0, 6).map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
        <ProjectLinks project={project} />
      </div>
    </Tile>
  );
}

function ProjectRow({ project, animate, order }: { project: Project; animate: boolean; order: number }) {
  return (
    <li
      className={cn(
        "group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-t border-line py-4 transition-colors hover:bg-surface md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto] md:px-2",
        animate && "enter",
      )}
      style={animate ? ({ "--i": order } as React.CSSProperties) : undefined}
    >
      <div className="min-w-0">
        <h4 className="display text-lg [overflow-wrap:anywhere] sm:text-xl">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {project.title}
          </Link>
        </h4>
        <p className="mt-1 line-clamp-2 text-sm text-ink-muted md:line-clamp-1">{project.description}</p>
      </div>
      <p className="label hidden text-ink-muted md:block">{project.role}</p>
      <div className="col-start-1 row-start-2 flex flex-wrap items-center gap-1.5 md:col-start-auto md:row-start-auto">
        <span className="label text-ink-muted">{project.year}</span>
        {project.status ? <Badge variant={statusBadgeVariant(project.status)}>{STATUS_LABEL[project.status]}</Badge> : null}
      </div>
      <div className="col-start-2 row-span-2 row-start-1 md:row-span-1 md:col-start-auto">
        <ProjectLinks project={project} />
      </div>
    </li>
  );
}

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [role, setRole] = useState(ALL);
  const [expanded, setExpanded] = useState(false);
  // Rows animate only when they newly appear after a visitor action (filter
  // switch or show more), never on first paint or when already on screen.
  const [interacted, setInteracted] = useState(false);
  const seen = useRef(new Set<string>());

  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);
  const rest = useMemo(() => projects.filter((p) => !p.featured), [projects]);
  const roles = useMemo(
    () => Array.from(new Set(rest.map((p) => p.role))).filter(Boolean).sort((a, b) => a.localeCompare(b)),
    [rest],
  );

  // Filter lives in ?filter= so it is shareable and survives back/forward.
  useEffect(() => {
    const read = () => {
      const value = new URLSearchParams(window.location.search).get("filter");
      setRole(value && roles.includes(value) ? value : ALL);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [roles]);

  const changeRole = (next: string) => {
    setInteracted(true);
    setRole(next);
    setExpanded(false);
    const url = new URL(window.location.href);
    if (next === ALL) url.searchParams.delete("filter");
    else url.searchParams.set("filter", next);
    window.history.pushState(null, "", url);
  };

  const filtered = role === ALL ? rest : rest.filter((p) => p.role === role);
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_SHOW);
  const keyOf = (project: Project) => `${role}-${project.slug}`;
  const fresh = visible.filter((project) => interacted && !seen.current.has(keyOf(project)));

  useEffect(() => {
    visible.forEach((project) => seen.current.add(keyOf(project)));
  });

  return (
    <Section id="projects" aria-labelledby="projects-title">
      <Container>
        <SectionHeading
          id="projects-title"
          eyebrow="Projects"
          title="Software built for real use."
          description="Web systems, product builds and blockchain work shaped by client needs, community projects and practical delivery."
        />

        {featured.length ? (
          <div className="mt-10 grid gap-1.5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, index) => (
              <FeaturedTile key={project.slug} project={project} index={index} wide={index === 0 && featured.length > 1} />
            ))}
          </div>
        ) : null}

        {rest.length ? (
          <div className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h3 className="display text-xl">
                More projects <span className="label align-middle text-ink-muted">({filtered.length})</span>
              </h3>
              {roles.length > 1 ? (
                <Listbox
                  label="Filter by role"
                  showLabel
                  value={role}
                  onChange={changeRole}
                  options={[ALL, ...roles].map((option) => ({ label: option === ALL ? "All roles" : option, value: option }))}
                  className="w-full sm:w-72"
                />
              ) : null}
            </div>

            <ol className="mt-5 border-b border-line" aria-live="polite">
              {visible.map((project) => (
                <ProjectRow
                  key={keyOf(project)}
                  project={project}
                  animate={fresh.includes(project)}
                  order={fresh.indexOf(project)}
                />
              ))}
              {filtered.length === 0 ? <li className="border-t border-line py-8 text-ink-muted">No projects match that role.</li> : null}
            </ol>

            <div className="mt-6 flex flex-wrap gap-2">
              {filtered.length > INITIAL_SHOW ? (
                <button type="button" aria-expanded={expanded} onClick={() => {
                    setInteracted(true);
                    setExpanded((v) => !v);
                  }} className={buttonClass("secondary")}>
                  {expanded ? "Show less" : `Show ${filtered.length - INITIAL_SHOW} more`}
                </button>
              ) : null}
              <Link href="/projects" className={buttonClass("ghost")}>
                All {projects.length} projects
              </Link>
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
