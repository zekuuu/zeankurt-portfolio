import { Plus } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface FaqSectionProps {
  items: ReadonlyArray<{ q: string; a: string }>;
}

/** Native <details>: answers are in the HTML and work without JS. */
export function FaqSection({ items }: FaqSectionProps) {
  return (
    <Section id="faq" aria-labelledby="faq-title">
      <Container className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="faq-title" index="05" eyebrow="FAQ" title="Quick answers." className="lg:block" />
        </div>

        <div className="border-b border-line lg:col-span-8">
          {items.map((item) => (
            <details key={item.q} className="group border-t border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <h3 className="display text-base leading-snug sm:text-lg">{item.q}</h3>
                <span
                  aria-hidden
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-transform duration-200 group-open:rotate-45 group-open:bg-ink group-open:text-bg"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </summary>
              <p className="max-w-[68ch] pb-6 leading-relaxed text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
