import type { Metadata } from "next";
import { PhotographyPageContent } from "@/components/photography/PhotographyPageContent";
import { getPortfolioContent } from "@/lib/cms/queries";

export const revalidate = 60;
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { absolute: "Photography by Zean Kurt Balboa (Shot by ZK)" },
    description: "Photography by Zean Kurt Balboa (Shot by ZK): portraits, events and street photography.",
    alternates: { canonical: "/photography" },
  };
}

export default async function PhotographyPage() {
  const content = await getPortfolioContent();

  return (
    <main id="main-content">
      <PhotographyPageContent
        creativeCategories={content.creativeCategories}
        siteConfig={content.siteConfig}
      />
    </main>
  );
}