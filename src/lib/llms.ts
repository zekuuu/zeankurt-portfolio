import { getPortfolioContent } from "@/lib/cms/queries";
import { absoluteUrl, identity, longBio } from "@/lib/identity";

/** Plain-text profile for LLM crawlers (llmstxt.org format). */
export async function buildLlmsTxt(full: boolean) {
  const { projects, experience, siteConfig } = await getPortfolioContent();
  const p = identity.profiles;

  const projectLines = projects.map((project) => {
    const links = [
      `page: ${absoluteUrl(`/projects/${project.slug}`)}`,
      project.githubUrl ? `code: ${project.githubUrl}` : null,
      project.liveUrl ? `live: ${project.liveUrl}` : null,
    ].filter(Boolean);

    const head = `- [${project.title}](${absoluteUrl(`/projects/${project.slug}`)}): ${project.description} (${project.year}, role: ${project.role}; stack: ${project.tags.join(", ")})`;

    if (!full) return head;

    return [head, project.longDescription ? `  ${project.longDescription}` : null, `  ${links.join(" | ")}`]
      .filter(Boolean)
      .join("\n");
  });

  const technicalExperience = experience.filter(
    (item) => !/photograph|videograph|editor/i.test(`${item.role} ${item.organization}`),
  );

  return [
    `# ${identity.name}`,
    "",
    `> ${identity.metaDescription}`,
    "",
    longBio,
    "",
    `Role: ${identity.jobTitles.join(" / ")}`,
    `Location: ${identity.location.label}`,
    `Education: ${identity.education.degree} (${identity.education.year}), ${identity.education.school}, ${identity.education.campus}`,
    `Credentials: ${identity.credentials.map((c) => `${c.issuer} ${c.name}`).join("; ")}`,
    `Stack: ${identity.stack.join(", ")}`,
    "",
    "## Awards",
    ...identity.awards.map((award) => `- ${award}`),
    "",
    "## Ventures",
    ...identity.ventures.map((v) => `- ${v.name}: ${v.role}. ${v.description}`),
    "",
    "## Projects",
    ...projectLines,
    ...(full
      ? [
          "",
          "## Experience and hackathons",
          ...technicalExperience.map(
            (item) => `- ${item.role}, ${item.organization} (${item.period}): ${item.description}`,
          ),
        ]
      : []),
    "",
    "## Profiles",
    `- GitHub: ${p.github}`,
    `- LinkedIn: ${p.linkedin}`,
    `- X: ${p.x}`,
    `- Devfolio: ${p.devfolio}`,
    `- DEV/STATION: ${p.devStation}`,
    "",
    "## Contact",
    `- Email: ${siteConfig.email}`,
    `- Open to: ${identity.lookingFor.join("; ")}`,
    "",
    "## Optional",
    `- [Full profile](${absoluteUrl("/llms-full.txt")})`,
    `- [Events and community](${absoluteUrl("/events")})`,
    `- [Photography](${absoluteUrl("/photography")}): separate hobby portfolio, not part of his developer work.`,
    "",
  ].join("\n");
}

export function textResponse(body: string) {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
