import type { MetadataRoute } from "next";
import { getPortfolioContent } from "@/lib/cms/queries";
import { absoluteUrl } from "@/lib/identity";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects, creativeCategories } = await getPortfolioContent();

  const lastProjectUpdate = projects
    .map((project) => project.updatedAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  const latest = lastProjectUpdate ? new Date(lastProjectUpdate) : new Date();

  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/projects"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: project.updatedAt ? new Date(project.updatedAt) : latest,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: absoluteUrl("/events"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/photography"), changeFrequency: "monthly", priority: 0.2 },
    ...creativeCategories.map((category) => ({
      url: absoluteUrl(`/photography/${category.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.2,
    })),
  ];
}
