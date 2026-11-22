"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Tile } from "@/components/ui/Tile";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content">
      <Container className="grid gap-1.5 py-10 sm:py-14 lg:grid-cols-12">
        <Tile variant="orange" className="flex min-h-64 items-end lg:col-span-5">
          <p className="display text-[clamp(4rem,14vw,8rem)] leading-none">Error</p>
        </Tile>
        <Tile className="flex flex-col justify-between gap-8 lg:col-span-7 lg:p-10">
          <div>
            <p className="label text-ink-muted">Error / Something broke</p>
            <h1 className="display mt-3 text-[clamp(2rem,5vw,3.5rem)]">This page failed to load.</h1>
            <p className="mt-4 max-w-prose leading-relaxed text-ink-muted">Try again, or head back to the homepage.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={reset} className={buttonClass("primary")}>
              Try again
            </button>
            <Link href="/" className={buttonClass("secondary")}>
              Back home
            </Link>
          </div>
        </Tile>
      </Container>
    </main>
  );
}
