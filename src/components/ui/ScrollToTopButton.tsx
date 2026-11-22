"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { scrollToTop } from "@/lib/smooth-scroll";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 520);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      data-no-print
      onClick={() => scrollToTop()}
      className={cn(
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-bg text-ink transition-opacity duration-200 hover:bg-ink hover:text-bg",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ArrowUp aria-hidden className="h-5 w-5" strokeWidth={1.75} />
    </button>
  );
}
