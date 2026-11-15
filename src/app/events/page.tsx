import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPortfolioContent } from "@/lib/cms/queries";
import { identity } from "@/lib/identity";

export const revalidate = 60;
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Events & Community",
  description: `Hackathons, conferences and Web3 community events ${identity.name} has joined in the Philippines.`,
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  const { eventHighlights } = await getPortfolioContent();

  return (
    <main id="main-content">
      <Section className="pt-28 sm:pt-32">
        <Container className="max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--foreground-muted)]">
            <Link href="/" className="hover:text-white">
              Home
            </Link>{" "}
            / <span>Events</span>
          </nav>

          <SectionHeading
            as="h1"
            eyebrow="Events"
            title={
              <>
                Events & <span className="emphasis-glow-blue">community</span>
              </>
            }
            description="Hackathons, conferences, workshops and meetups across the Philippine developer and Web3 community."
          />

          <ol className="mt-9 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)]">
            {eventHighlights.map((event) => (
              <li key={event.id} className="grid gap-1 p-4 sm:grid-cols-[8rem_1fr] sm:gap-4 sm:p-5">
                <p className="font-mono text-xs text-[var(--blue-300)]">{event.date}</p>
                <div>
                  <h2 className="text-base font-semibold text-white">{event.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-[var(--foreground)]/80">
                    {[event.role, event.venue, event.organizers].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </main>
  );
}
