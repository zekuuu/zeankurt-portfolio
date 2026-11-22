"use client";

import { usePathname } from "next/navigation";

/** Renders public-site chrome (footer, badges, progress bar) everywhere except /admin. */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  return pathname.startsWith("/admin") ? null : <>{children}</>;
}
