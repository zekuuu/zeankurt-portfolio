"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PhotoItem } from "@/types";

interface LightboxProps {
  photos: PhotoItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const control =
  "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-on-overlay text-on-overlay transition-colors hover:bg-on-overlay hover:text-overlay";

/** Always-dark native dialog for image fidelity: focus trap, Esc and focus restore built in. */
export function Lightbox({ photos, activeIndex, onClose, onNavigate }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const photo = activeIndex !== null ? photos[activeIndex] : null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (photo && !dialog.open) dialog.showModal();
    if (!photo && dialog.open) dialog.close();
    document.documentElement.style.overflow = photo ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [photo]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (activeIndex === null) return;
    if (event.key === "ArrowRight" && activeIndex < photos.length - 1) onNavigate(activeIndex + 1);
    if (event.key === "ArrowLeft" && activeIndex > 0) onNavigate(activeIndex - 1);
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onKeyDown={onKeyDown}
      aria-label={photo?.title ?? "Photo"}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-overlay p-0 text-on-overlay backdrop:bg-overlay"
    >
      {photo && activeIndex !== null ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-on-overlay px-4 py-3">
            <p className="label">
              {String(activeIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")} · {photo.category}
            </p>
            <button type="button" autoFocus onClick={onClose} aria-label="Close lightbox" className={control}>
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center p-3 sm:px-20">
            {photo.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={photo.id} src={photo.image} alt={photo.title} className="block max-h-full max-w-full object-contain" />
            ) : (
              <p className="label">No image uploaded</p>
            )}

            {activeIndex > 0 ? (
              <button
                type="button"
                onClick={() => onNavigate(activeIndex - 1)}
                aria-label="Previous photo"
                className={`${control} absolute bottom-3 left-3 sm:bottom-auto sm:left-4 sm:top-1/2 sm:-translate-y-1/2`}
              >
                <ChevronLeft aria-hidden className="h-5 w-5" />
              </button>
            ) : null}
            {activeIndex < photos.length - 1 ? (
              <button
                type="button"
                onClick={() => onNavigate(activeIndex + 1)}
                aria-label="Next photo"
                className={`${control} absolute bottom-3 right-3 sm:bottom-auto sm:right-4 sm:top-1/2 sm:-translate-y-1/2`}
              >
                <ChevronRight aria-hidden className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          <p className="border-t border-on-overlay px-4 py-3 text-center text-sm">{photo.title}</p>
        </div>
      ) : null}
    </dialog>
  );
}
