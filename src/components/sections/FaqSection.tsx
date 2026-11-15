import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface FaqSectionProps {
  items: ReadonlyArray<{ q: string; a: string }>;
}

/** Server-rendered, no JS needed: answers are in the HTML even when collapsed. */
export function FaqSection({ items }: FaqSectionProps) {
  return (
    <Section id="faq" className="py-10 sm:py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Quick <span className="emphasis-glow-blue">answers</span>.
            </>
          }
        />

        <div className="mt-7 grid gap-3 sm:mt-9">
          {items.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 transition open:border-[var(--border-strong)] sm:p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                <h3 className="font-[family-name:var(--font-syne)] text-base font-semibold text-white sm:text-lg">
                  {item.q}
                </h3>
                <span
                  aria-hidden
                  className="shrink-0 text-xl leading-none text-[var(--blue-300)] transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
