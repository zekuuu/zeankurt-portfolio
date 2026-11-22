import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
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
      <Container className="py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="label text-ink-muted">
          <Link href="/" className="inline-flex min-h-11 items-center hover:text-primary">
            Home
          </Link>{" "}
          / <span className="text-ink">Events</span>
        </nav>

        <SectionHeading
          as="h1"
          index="04"
          eyebrow="Events"
          title="Events & community"
          description="Hackathons, conferences, workshops and meetups across the Philippine developer and Web3 community."
          className="mt-6"
        />

        <ol className="mt-10 border-b border-line">
          {eventHighlights.map((event) => (
            <li key={event.id} className="grid gap-2 border-t border-line py-5 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:gap-6">
              <p className="label text-ink-muted">{event.date}</p>
              <div className="min-w-0">
                <h2 className="display text-lg leading-snug [overflow-wrap:anywhere]">{event.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted [overflow-wrap:anywhere]">
                  {[event.role, event.venue, event.organizers].filter(Boolean).join(" · ")}
                </p>
              </div>
              {event.category ? (
                <div>
                  <Badge variant={event.category === "hackathon" ? "wip" : "default"}>{event.category}</Badge>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </main>
  );
}
