import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Tile } from "@/components/ui/Tile";

export default function NotFound() {
  return (
    <main id="main-content">
      <Container className="grid gap-1.5 py-10 sm:py-14 lg:grid-cols-12">
        <Tile variant="orange" className="flex min-h-64 items-end lg:col-span-5">
          <p className="display text-[clamp(5rem,18vw,11rem)] leading-none">404</p>
        </Tile>
        <Tile className="flex flex-col justify-between gap-8 lg:col-span-7 lg:p-10">
          <div>
            <p className="label text-ink-muted">Page not found</p>
            <h1 className="display mt-3 text-[clamp(2rem,5vw,3.5rem)]">This page does not exist.</h1>
            <p className="mt-4 max-w-prose leading-relaxed text-ink-muted">
              The link may be old or mistyped. The projects and contact details are one click away.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className={buttonClass("primary")}>
              Back home
            </Link>
            <Link href="/projects" className={buttonClass("secondary")}>
              All projects
            </Link>
          </div>
        </Tile>
      </Container>
    </main>
  );
}
