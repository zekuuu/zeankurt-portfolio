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

const pill =
  "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-on-overlay px-3 text-on-overlay transition-colors hover:bg-on-overlay hover:text-overlay disabled:cursor-not-allowed disabled:opacity-40";

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

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; panX: number; panY: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const lastTap = useRef(0);

  const open = index !== null && Boolean(current);
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < items.length - 1;
  const go = (next: number) => onIndexChange?.(Math.min(items.length - 1, Math.max(0, next)));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  // New image: reset zoom and loading state, preload the neighbours.
  useEffect(() => {
    setStatus("loading");
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (index === null) return;
    [items[index - 1], items[index + 1]].forEach((item) => {
      if (item?.src && item.kind !== "pdf") new Image().src = item.src;
    });
  }, [index, items, retry]);

  const toggleZoom = (to?: number) => {
    const next = to ?? (zoom > 1 ? 1 : 2);
    setZoom(next);
    if (next === 1) setPan({ x: 0, y: 0 });
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

    // Double tap (touch) toggles zoom; mouse uses onDoubleClick.
    if (event.pointerType === "touch" && !start.moved) {
      const now = performance.now();
      if (now - lastTap.current < 300) toggleZoom();
      lastTap.current = now;
    }
  };

  const count = items.length > 1 && index !== null ? `${index + 1} of ${items.length}` : null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={onKeyDown}
      aria-label={current?.alt ?? "Image viewer"}
      className="viewer m-auto h-[min(92dvh,60rem)] w-[min(96vw,80rem)] max-h-none max-w-none bg-transparent p-0 text-on-overlay"
    >
      {current ? (
        <div className="flex h-full flex-col overflow-hidden rounded-tile border border-on-overlay bg-overlay">
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
              onDoubleClick={current.kind === "pdf" ? undefined : () => toggleZoom()}
            >
              {status === "loading" && current.src ? (
                <span aria-hidden className="absolute inset-x-0 top-0 h-px overflow-hidden">
                  <span className="viewer-loading block h-full w-1/3 bg-on-overlay" />
                </span>
              ) : null}

              {!current.src || status === "error" ? (
                <div role="alert" className="flex flex-col items-center gap-3 p-6 text-center">
                  <p>{current.src ? "Couldn't load this image." : "No image uploaded."}</p>
                  {current.src ? (
                    <button type="button" onClick={() => setRetry((n) => n + 1)} className={pill}>
                      Retry
                    </button>
                  ) : null}
                </div>
              ) : current.kind === "pdf" ? (
                <iframe
                  src={current.src}
                  title={current.alt}
                  onLoad={() => setStatus("ready")}
                  className="h-full w-full rounded-field border-0 bg-surface"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${current.id}-${retry}`}
                  src={current.src}
                  alt={current.alt}
                  draggable={false}
                  onLoad={() => setStatus("ready")}
                  onError={() => setStatus("error")}
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
                        "block h-11 w-14 overflow-hidden rounded-[8px] border transition-opacity",
                        i === index ? "border-on-overlay opacity-100" : "border-transparent opacity-50 hover:opacity-100",
                      )}
                    >
                      {item.thumb ?? item.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.thumb ?? item.src} alt="" loading="lazy" className="h-full w-full object-cover" />
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
