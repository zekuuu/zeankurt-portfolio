"use client";

import { useEffect, useMemo, useRef } from "react";
import type { PhotoItem } from "@/types";
import { ImageViewer } from "@/components/ui/ImageViewer";

interface LightboxProps {
  photos: PhotoItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const PARAM = "photo";

function setPhotoParam(id: string | null, mode: "push" | "replace") {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set(PARAM, id);
  else url.searchParams.delete(PARAM);
  window.history[mode === "push" ? "pushState" : "replaceState"](window.history.state, "", url);
}

/**
 * Gallery viewer with shareable links: opening a photo adds ?photo=<id>, a link
 * with that param opens the photo, and the Back button closes the viewer.
 */
export function Lightbox({ photos, activeIndex, onClose, onNavigate }: LightboxProps) {
  const pushed = useRef(false);
  const items = useMemo(
    () =>
      photos.map((photo) => ({
        id: photo.id,
        src: photo.image,
        alt: photo.title,
        meta: photo.category,
      })),
    [photos],
  );

  // Open from the URL on load and follow back/forward.
  useEffect(() => {
    const sync = () => {
      const id = new URLSearchParams(window.location.search).get(PARAM);
      const index = id ? photos.findIndex((photo) => photo.id === id) : -1;
      if (index >= 0) onNavigate(index);
      else {
        pushed.current = false;
        onClose();
      }
    };
    if (new URLSearchParams(window.location.search).has(PARAM)) sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  // Keep the URL in step with the open photo.
  useEffect(() => {
    if (activeIndex === null) return;
    const id = photos[activeIndex]?.id;
    if (!id || new URLSearchParams(window.location.search).get(PARAM) === id) return;
    if (pushed.current) setPhotoParam(id, "replace");
    else {
      setPhotoParam(id, "push");
      pushed.current = true;
    }
  }, [activeIndex, photos]);

  const close = () => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back(); // popstate closes the viewer
    } else {
      setPhotoParam(null, "replace");
      onClose();
    }
  };

  return <ImageViewer items={items} index={activeIndex} onClose={close} onIndexChange={onNavigate} filmstrip />;
}
