import { cn } from "@/lib/cn";
import type { PhotoItem } from "@/types";

interface GalleryGridProps {
  photos: PhotoItem[];
  onPhotoClick: (photo: PhotoItem, index: number) => void;
  className?: string;
}

/** Aspect placeholder from the CMS bucket, so lazy images never shift layout. */
export const ASPECT_CLASS: Record<PhotoItem["aspectRatio"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
};

/** CSS-columns masonry: no JS measuring, 6px gaps, rounded tiles. Titles live in alt text and the viewer. */
export function GalleryGrid({ photos, onPhotoClick, className }: GalleryGridProps) {
  return (
    <ul className={cn("columns-2 gap-1.5 lg:columns-3 2xl:columns-4", className)}>
      {photos.map((photo, index) => (
        <li key={photo.id} className="enter mb-1.5 break-inside-avoid" style={{ "--i": index } as React.CSSProperties}>
          <button
            type="button"
            onClick={() => onPhotoClick(photo, index)}
            className="group block w-full cursor-zoom-in text-left"
          >
            <span className={cn("relative block overflow-hidden rounded-tile bg-surface-2", ASPECT_CLASS[photo.aspectRatio])}>
              {photo.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo.image}
                  alt={photo.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
                />
              ) : (
                <span className="label absolute inset-0 flex items-center justify-center text-ink-muted">No image</span>
              )}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
