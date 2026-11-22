"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";
import { cn } from "@/lib/cn";
import { ImageViewer } from "@/components/ui/ImageViewer";

interface ZoomableImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  /** Kept for API compatibility; the viewer always shows the full image. */
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
  unoptimized,
  buttonClassName,
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={cn("group relative h-full w-full", className)}>
        <button
          type="button"
          aria-label={`Zoom ${alt}`}
          onClick={() => setOpen(true)}
          className={cn(
            "absolute right-2 top-2 z-20 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-on-overlay bg-overlay text-on-overlay hover-fill",
            buttonClassName,
          )}
        >
          <Expand aria-hidden className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label={`Open ${alt}`}
          onClick={() => setOpen(true)}
          className="absolute inset-0 z-10 cursor-zoom-in"
        />

        <Image src={src} alt={alt} fill unoptimized={unoptimized} sizes={sizes} className={cn("object-cover", imageClassName)} />
      </div>

      <ImageViewer items={[{ id: src, src, alt }]} index={open ? 0 : null} onClose={() => setOpen(false)} />
    </>
  );
}
