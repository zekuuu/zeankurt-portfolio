"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tile } from "@/components/ui/Tile";
import { cn } from "@/lib/cn";
import type { Certification, EventHighlight, ExperienceItem } from "@/types";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Work", value: "work" },
  { label: "Community", value: "community" },
  { label: "Hackathon", value: "hackathon" },
] as const satisfies ReadonlyArray<{ label: string; value: ExperienceItem["type"] | "all" }>;

type Filter = (typeof FILTERS)[number]["value"];

const EVENTS_PREVIEW = 6;

interface ExperienceSectionProps {
  experience: ExperienceItem[];
  certifications: Certification[];
  eventHighlights: EventHighlight[];
}

/** Groups issuers with 3+ certs; the rest go under "Other". */
function groupCertifications(certifications: Certification[]) {
  const byIssuer = new Map<string, Certification[]>();
  certifications.forEach((cert) => byIssuer.set(cert.issuer, [...(byIssuer.get(cert.issuer) ?? []), cert]));
  const major = [...byIssuer].filter(([, items]) => items.length >= 3);
  const other = [...byIssuer].filter(([, items]) => items.length < 3).flatMap(([, items]) => items);
  return other.length ? [...major, ["Other", other] as [string, Certification[]]] : major;
}

function CertificateViewer({ cert, onClose }: { cert: { name: string; image: string } | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (cert && !dialog.open) dialog.showModal();
    if (!cert && dialog.open) dialog.close();
  }, [cert]);

  const isPdf = cert?.image.toLowerCase().endsWith(".pdf") ?? false;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={cert?.name ?? "Certificate"}
      className="m-auto w-[min(64rem,calc(100vw-1.5rem))] max-w-none bg-overlay p-0 text-on-overlay backdrop:bg-overlay"
    >
      {cert ? (
        <div className="border border-on-overlay p-3 sm:p-4">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium [overflow-wrap:anywhere]">{cert.name}</p>
              <p className="label mt-1 opacity-80">Certificate viewer</p>
            </div>
            <button
              type="button"
              autoFocus
              onClick={onClose}
              aria-label="Close certificate viewer"
              className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-on-overlay hover:bg-on-overlay hover:text-overlay"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>
          {isPdf ? (
            <iframe src={cert.image} title={cert.name} className="h-[75vh] w-full border-0 bg-surface" />
          ) : (
            <div className="relative h-[75vh] w-full">
              <Image src={cert.image} alt={cert.name} fill sizes="100vw" className="object-contain" />
            </div>
          )}
        </div>
      ) : null}
    </dialog>
  );
}

export function ExperienceSection({ experience, certifications, eventHighlights }: ExperienceSectionProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeCert, setActiveCert] = useState<{ name: string; image: string } | null>(null);

  const items = filter === "all" ? experience : experience.filter((item) => item.type === filter);
  const certGroups = useMemo(() => groupCertifications(certifications), [certifications]);
  const events = useMemo(
    () => [...eventHighlights].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, EVENTS_PREVIEW),
    [eventHighlights],
  );

  return (
    <Section id="experience" aria-labelledby="experience-title" surface="subtle">
      <Container>
        <SectionHeading
          id="experience-title"
          index="04"
          eyebrow="Experience"
          title="Work, community and hackathons."
          description="Roles, hackathon builds, certifications and the events behind them."
        />

        <div className="mt-10 grid gap-1.5 lg:grid-cols-12">
          <Tile className="lg:col-span-7 lg:p-8">
            <div role="group" aria-label="Filter experience" className="flex flex-wrap gap-1.5">
              {FILTERS.map((option) => {
                const count = option.value === "all" ? experience.length : experience.filter((i) => i.type === option.value).length;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={filter === option.value}
                    onClick={() => setFilter(option.value)}
                    className={cn(
                      "label inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-4 transition-colors",
                      filter === option.value ? "bg-ink text-bg" : "hover:bg-surface-2",
                    )}
                  >
                    {option.label}
                    <span className="opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>

            <ol className="mt-8 border-l border-line">
              {items.map((item) => (
                <li key={item.id} className="relative pb-8 pl-6 last:pb-0">
                  <span aria-hidden className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full border border-line bg-surface" />
                  <p className="label text-ink-muted">{item.period}</p>
                  <h3 className="display mt-2 text-lg leading-snug [overflow-wrap:anywhere] sm:text-xl">{item.role}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="font-medium [overflow-wrap:anywhere]">{item.organization}</span>
                    <Badge variant={item.type === "hackathon" ? "wip" : "default"}>{item.type}</Badge>
                  </div>
                  <p className="mt-3 max-w-[64ch] leading-relaxed text-ink-muted [overflow-wrap:anywhere]">{item.description}</p>
                </li>
              ))}
              {items.length === 0 ? <li className="pl-6 text-ink-muted">Nothing in this category yet.</li> : null}
            </ol>
          </Tile>

          <div className="grid content-start gap-1.5 lg:col-span-5">
            <Tile>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="display text-xl">Certifications</h3>
                <span className="label text-ink-muted">{certifications.length}</span>
              </div>
              {certGroups.map(([issuer, certs]) => (
                <section key={issuer} className="mt-6" aria-label={issuer}>
                  <p className="label text-ink-muted">{issuer}</p>
                  <ul className="mt-2">
                    {certs.map((cert) => (
                      <li key={cert.id ?? `${cert.issuer}-${cert.name}`} className="flex items-center justify-between gap-3 border-t border-line-soft py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium [overflow-wrap:anywhere]">{cert.name}</p>
                          <p className="label mt-1 text-ink-muted">{[cert.issuer, cert.issued].filter(Boolean).join(" · ")}</p>
                        </div>
                        {cert.image ? (
                          <button
                            type="button"
                            onClick={() => setActiveCert({ name: cert.name, image: cert.image ?? "" })}
                            className="label inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full border border-line px-3 hover:bg-ink hover:text-bg"
                          >
                            View<span className="sr-only"> {cert.name}</span>
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </Tile>

            <Tile variant="yellow">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="display text-xl">Recent events</h3>
                <span className="label">{eventHighlights.length}</span>
              </div>
              <ul className="mt-4">
                {events.map((event) => (
                  <li key={event.id} className="border-t border-on-block py-3">
                    <p className="label">
                      {event.date}
                      {event.category ? ` · ${event.category}` : ""}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-snug [overflow-wrap:anywhere]">{event.title}</p>
                    <p className="mt-0.5 text-sm [overflow-wrap:anywhere]">{[event.role, event.venue].filter(Boolean).join(" · ")}</p>
                  </li>
                ))}
              </ul>
              <Link
                href="/events"
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-on-block px-5 text-sm font-medium transition-colors hover:bg-on-block hover:text-block-yellow"
              >
                All events <ArrowUpRight aria-hidden className="h-4 w-4" />
              </Link>
            </Tile>
          </div>
        </div>
      </Container>

      <CertificateViewer cert={activeCert} onClose={() => setActiveCert(null)} />
    </Section>
  );
}
