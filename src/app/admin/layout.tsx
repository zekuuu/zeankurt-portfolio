import { ScrollProgressBar } from "@/components/animation/ScrollProgressBar";
import { GsapInit } from "@/lib/gsap";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Loader intentionally omitted from admin layout to avoid blocking scroll

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <GsapInit />
      <ScrollProgressBar />
      <main className="flex-1">{children}</main>
    </>
  );
}
