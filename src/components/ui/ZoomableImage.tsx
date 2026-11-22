"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Expand, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ZoomableImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  modalImageClassName?: string;
  unoptimized?: boolean;
  buttonClassName?: string;
}

export function ZoomableImage({
  src,
  alt,
  sizes = "100vw",
  className,
  imageClassName,
  modalImageClassName,
  unoptimized,
  buttonClassName,
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setVisible(true);
      return;
    }

    if (!visible) return;

    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, 280);

    return () => window.clearTimeout(timeout);
  }, [open, visible]);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible]);

  return (
    <>
      <div className={cn("group relative h-full w-full", className)}>
        <button
          type="button"
          aria-label={`Zoom ${alt}`}
          data-interactive
          onClick={() => setOpen(true)}
          className={cn(
            "absolute right-2 top-2 z-20 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-on-overlay bg-overlay text-on-overlay transition-colors hover:bg-on-overlay hover:text-overlay",
            buttonClassName,
          )}
        >
          <Expand className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label={`Open ${alt}`}
          data-interactive
          onClick={() => setOpen(true)}
          className="absolute inset-0 z-10 cursor-zoom-in"
        />

        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={unoptimized}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </div>

      {visible && mounted ? createPortal(
        <div
          data-preview-overlay="true"
          className={cn(
            "fixed inset-0 z-[10000] flex items-center justify-center bg-overlay p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] text-on-overlay sm:p-4",
            open
              ? "motion-safe:animate-[zoomableBackdropIn_220ms_ease-out_forwards]"
              : "motion-safe:animate-[zoomableBackdropOut_220ms_cubic-bezier(0.4,0,1,1)_forwards]",
          )}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-on-overlay text-on-overlay transition-colors hover:bg-on-overlay hover:text-overlay sm:right-4 sm:top-4"
            aria-label="Close image preview"
            autoFocus
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className={cn(
              "relative max-h-[80dvh] w-full max-w-6xl",
              open
                ? "motion-safe:animate-[zoomableModalIn_280ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
                : "motion-safe:animate-[zoomableModalOut_220ms_cubic-bezier(0.4,0,1,1)_forwards]",
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[80dvh] max-h-[80dvh] w-full overflow-hidden">
              <Image
                src={src}
                alt={alt}
                fill
                unoptimized={unoptimized}
                sizes="100vw"
                priority
                className={cn(
                  "object-contain",
                  open
                    ? "motion-safe:animate-[zoomableImageIn_280ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
                    : "motion-safe:animate-[zoomableImageOut_220ms_cubic-bezier(0.4,0,1,1)_forwards]",
                  modalImageClassName,
                )}
              />
            </div>
          </div>
        </div>
      , document.body) : null}
    </>
  );
}
