import { Plus } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** One accent per question, cycling; full class strings so Tailwind keeps them. */
const ACCENTS = [
  "group-open:border-primary group-open:bg-primary group-open:text-on-primary",
  "group-open:border-on-block group-open:bg-block-yellow group-open:text-on-block",
  "group-open:border-on-block group-open:bg-block-orange group-open:text-on-block",
  "group-open:border-on-block group-open:bg-block-green group-open:text-on-block",
];

interface FaqSectionProps {
  items: ReadonlyArray<{ q: string; a: string }>;
}

/**
 * Native <details>: answers are in the HTML and work without JS. The shared
 * `name` makes it an exclusive accordion (opening one closes the others) in
 * current browsers; older ones simply allow several open.
 */
export function FaqSection({ items }: FaqSectionProps) {
  return (
    <Section id="faq" aria-labelledby="faq-title">
      <Container className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Quick answers." className="lg:block" />
        </div>

        <div className="border-b border-line lg:col-span-8">
          {items.map((item, index) => (
            <details key={item.q} name="faq" className="group border-t border-line">
              <summary className="hover-group flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <h3 className="display text-base leading-snug sm:text-lg">{item.q}</h3>
                <span
                  aria-hidden
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-line transition-[rotate,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-open:rotate-45 hover-target ${ACCENTS[index % ACCENTS.length]}`}
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
