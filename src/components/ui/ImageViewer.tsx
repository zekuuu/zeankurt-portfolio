"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { lockScroll } from "@/lib/smooth-scroll";

export interface ViewerItem {
  id: string;
  src?: string;
  alt: string;
  /** Shown in the bottom bar; defaults to alt. */
  caption?: string;
  /** Small mono text in the top bar, e.g. a category. */
  meta?: string;
  /** Thumbnail for the filmstrip; defaults to src. */
  thumb?: string;
  kind?: "image" | "pdf";
}

interface ImageViewerProps {
  items: ViewerItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  /** Thumbnail strip for galleries. */
  filmstrip?: boolean;
}

/**
 * Serve viewer images through Next's optimizer (WebP, max 1920px) instead of
 * the full-size originals. Data/blob URLs and PDFs pass through untouched.
 */
function viewerSrc(src: string, width = 1920) {
  if (!/^(https?:)?\/\/|^\//.test(src) || src.startsWith("/_next/")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

const pill =
  "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-none border border-on-overlay px-3 text-on-overlay transition-colors hover:bg-on-overlay hover:text-overlay disabled:cursor-not-allowed disabled:opacity-40";

/**
 * One framed, always-dark viewer for project screenshots, photos and
 * certificates. Native <dialog> gives the focus trap, Esc and focus restore; the
 * backdrop is the single blurred surface in the design system.
 */
export function ImageViewer({ items, index, onClose, onIndexChange, filmstrip = false }: ImageViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastIndex = useRef(0);
  if (index !== null) lastIndex.current = index;
  const current = items[index ?? lastIndex.current];

  // Load state is keyed by URL, so a cached image that finishes before an
  // effect runs can never be reset back to "loading".
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; panX: number; panY: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  const open = index !== null && Boolean(current);
  // Content renders only while open (plus the 120ms exit), so closed viewers
  // never download their images.
  const [visible, setVisible] = useState(false);
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < items.length - 1;
  const go = (next: number) => onIndexChange?.(Math.min(items.length - 1, Math.max(0, next)));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) {
      const timer = window.setTimeout(() => setVisible(false), 150);
      return () => window.clearTimeout(timer);
    }
    setVisible(true);
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  // New image: reset zoom, preload the neighbours.
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (index === null) return;
    [items[index - 1], items[index + 1]].forEach((item) => {
      if (item?.src && item.kind !== "pdf") new Image().src = viewerSrc(item.src);
    });
  }, [index, items, retry]);

  /** Zoom 2x toward a point (relative to the frame centre), or back to fit. */
  const toggleZoom = (to?: number, focus?: { x: number; y: number }) => {
    const next = to ?? (zoom > 1 ? 1 : 2);
    setZoom(next);
    setPan(next === 1 || !focus ? { x: 0, y: 0 } : { x: -focus.x, y: -focus.y });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" && hasNext) go(index! + 1);
    else if (event.key === "ArrowLeft" && hasPrev) go(index! - 1);
    else if (event.key === "+" || event.key === "=") toggleZoom(2);
    else if (event.key === "-") toggleZoom(1);
  };

  const onPointerDown = (event: ReactPointerEvent) => {
    drag.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y, moved: false };
    if (zoom > 1) {
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      setDragging(true);
    }
  };

  const onPointerMove = (event: ReactPointerEvent) => {
    const start = drag.current;
    if (!start || zoom === 1) return;
    start.moved = true;
    setPan({ x: start.panX + (event.clientX - start.x), y: start.panY + (event.clientY - start.y) });
  };

  const onPointerUp = (event: ReactPointerEvent) => {
    const start = drag.current;
    drag.current = null;
    setDragging(false);
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    // Swipe to change photo (only when not zoomed).
    if (zoom === 1 && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 && hasNext) go(index! + 1);
      if (dx > 0 && hasPrev) go(index! - 1);
      return;
    }

    // A plain click or tap (no drag) zooms in toward that point, or back out.
    if (!start.moved && Math.abs(dx) < 6 && Math.abs(dy) < 6) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      toggleZoom(undefined, {
        x: event.clientX - (rect.left + rect.width / 2),
        y: event.clientY - (rect.top + rect.height / 2),
      });
    }
  };

  const src = current?.src ? (current.kind === "pdf" ? current.src : viewerSrc(current.src)) : undefined;
  const status: "loading" | "ready" | "error" =
    src && failedSrc === src ? "error" : src && loadedSrc === src ? "ready" : "loading";

  const count = items.length > 1 && index !== null ? `${index + 1} of ${items.length}` : null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={onKeyDown}
      aria-label={current?.alt ?? "Image viewer"}
      className="viewer m-auto h-[min(92dvh,60rem)] w-[min(96vw,80rem)] max-h-none max-w-none bg-transparent p-0 text-on-overlay"
    >
      {current && (open || visible) ? (
        <div className="flex h-full flex-col overflow-hidden rounded-none border border-on-overlay bg-overlay">
          <div className="flex items-center justify-between gap-3 border-b border-on-overlay px-3 py-2 sm:px-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{current.caption ?? current.alt}</p>
              {current.meta || count ? (
                <p className="label truncate opacity-80">{[current.meta, count].filter(Boolean).join(" · ")}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {current.kind !== "pdf" ? (
                <button
                  type="button"
                  onClick={() => toggleZoom()}
                  aria-label={zoom > 1 ? "Zoom out" : "Zoom in"}
                  aria-pressed={zoom > 1}
                  className={pill}
                >
                  {zoom > 1 ? <Minus aria-hidden className="h-4 w-4" /> : <Plus aria-hidden className="h-4 w-4" />}
                </button>
              ) : null}
              <button type="button" autoFocus onClick={onClose} aria-label="Close viewer" className={pill}>
                <X aria-hidden className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 p-1.5">
            <div
              className={cn(
                "relative flex h-full touch-none select-none items-center justify-center overflow-hidden rounded-field border border-on-overlay/30",
                current.kind !== "pdf" && (zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"),
              )}
              onPointerDown={current.kind === "pdf" ? undefined : onPointerDown}
              onPointerMove={current.kind === "pdf" ? undefined : onPointerMove}
              onPointerUp={current.kind === "pdf" ? undefined : onPointerUp}
              onPointerCancel={() => (drag.current = null)}
            >
              {status === "loading" && current.src ? (
                <span aria-hidden className="viewer-loading-wrap absolute inset-x-0 top-0 h-px overflow-hidden">
                  <span className="viewer-loading block h-full w-1/3 bg-on-overlay" />
                </span>
              ) : null}

              {!current.src || status === "error" ? (
                <div role="alert" className="flex flex-col items-center gap-3 p-6 text-center">
                  <p>{current.src ? "Couldn't load this image." : "No image uploaded."}</p>
                  {current.src ? (
                    <button
                      type="button"
                      onClick={() => {
                        setFailedSrc(null);
                        setRetry((n) => n + 1);
                      }}
                      className={pill}
                    >
                      Retry
                    </button>
                  ) : null}
                </div>
              ) : current.kind === "pdf" ? (
                <iframe
                  src={current.src}
                  title={current.alt}
                  onLoad={() => setLoadedSrc(src ?? null)}
                  className="h-full w-full rounded-field border-0 bg-surface"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${current.id}-${retry}`}
                  ref={(el) => {
                    if (el?.complete && el.naturalWidth > 0 && src) setLoadedSrc(src);
                  }}
                  src={src}
                  alt={current.alt}
                  draggable={false}
                  onLoad={() => setLoadedSrc(src ?? null)}
                  onError={() => setFailedSrc(src ?? null)}
                  style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                  className={cn(
                    "viewer-img max-h-full max-w-full object-contain",
                    !dragging && "transition-transform duration-200 ease-out",
                  )}
                />
              )}
            </div>
          </div>

          {items.length > 1 ? (
          <div className="flex items-center gap-3 border-t border-on-overlay px-3 py-2 sm:px-4">
            {items.length > 1 ? (
              <button type="button" onClick={() => go(index! - 1)} disabled={!hasPrev} aria-label="Previous image" className={pill}>
                <ChevronLeft aria-hidden className="h-5 w-5" />
              </button>
            ) : null}

            {filmstrip && items.length > 1 ? (
              <ul data-lenis-prevent className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1" aria-label="Thumbnails">
                {items.map((item, i) => (
                  <li key={item.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Show image ${i + 1} of ${items.length}`}
                      aria-current={i === index ? "true" : undefined}
                      ref={(el) => {
                        if (el && i === index) el.scrollIntoView({ block: "nearest", inline: "nearest" });
                      }}
                      className={cn(
                        "block h-11 w-14 overflow-hidden rounded-none border transition-opacity",
                        i === index ? "border-on-overlay opacity-100" : "border-transparent opacity-50 hover:opacity-100",
                      )}
                    >
                      {item.thumb ?? item.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={viewerSrc((item.thumb ?? item.src)!, 128)} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="flex-1" />
            )}

            {items.length > 1 ? (
              <button type="button" onClick={() => go(index! + 1)} disabled={!hasNext} aria-label="Next image" className={pill}>
                <ChevronRight aria-hidden className="h-5 w-5" />
              </button>
            ) : null}
          </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
