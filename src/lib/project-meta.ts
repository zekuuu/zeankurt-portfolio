import type { Project } from "@/types";

const OWN_GITHUB = /github\.com\/zekuuu\//i;

export function isTeamRepo(project: Project) {
  return Boolean(project.githubUrl && !OWN_GITHUB.test(project.githubUrl));
}

/** Honest status chips derived only from data the CMS actually has. */
export function projectBadges(project: Project) {
  const badges: string[] = [];
  if (project.status === "live") badges.push("Shipped");
  if (project.status === "wip") badges.push("In progress");
  if (project.status === "archived") badges.push("Archived");
  if (isTeamRepo(project)) badges.push("Team repo");
  if (/hackathon/i.test(`${project.description} ${project.tags.join(" ")}`)) {
    badges.push("Hackathon");
  }
  return badges;
}
