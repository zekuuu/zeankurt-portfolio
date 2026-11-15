import { getPortfolioContent } from "@/lib/cms/queries";
import { identity } from "@/lib/identity";
import { defaultOgCopy, ogSize, renderOgImage } from "@/lib/og";

export const alt = `Project by ${identity.name}`;
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const { projects } = await getPortfolioContent();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { projects } = await getPortfolioContent();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return renderOgImage(defaultOgCopy);

  return renderOgImage({
    eyebrow: `Project · ${project.year}`,
    title: project.title,
    subtitle: `${project.role} · ${identity.name}`,
    chips: project.tags,
  });
}
