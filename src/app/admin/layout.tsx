import Link from "next/link";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="sticky top-0 z-50 flex h-[var(--header-height)] items-center justify-between gap-3 border-b border-line bg-bg px-4 sm:px-6">
        <Link href="/" className="display flex min-h-11 items-center gap-2 text-xl">
          ZK.<span className="sr-only"> Home</span>
          <span className="label text-ink-muted">/ Admin</span>
        </Link>
        <ThemeToggle />
      </div>
      {/* Admin pages render their own <main>; this wrapper only anchors the skip link. */}
      <div id="main-content" className="flex-1">
        {children}
      </div>
    </>
  );
}
