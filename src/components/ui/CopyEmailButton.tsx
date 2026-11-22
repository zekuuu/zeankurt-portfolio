"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";

type ButtonVariant = Parameters<typeof buttonClass>[0];

/** Copies the address and announces the result; the mailto link stays the fallback. */
export function CopyEmailButton({ email, variant = "secondary", className }: { email: string; variant?: ButtonVariant; className?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    window.setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <>
      <button type="button" onClick={copy} className={buttonClass(variant, className)}>
        {status === "copied" ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />}
        {status === "copied" ? "Copied" : "Copy email"}
      </button>
      <span role="status" className="sr-only">
        {status === "copied" ? `Copied ${email} to the clipboard` : status === "failed" ? "Copy failed. Use the email link instead." : ""}
      </span>
    </>
  );
}
