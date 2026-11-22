"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PhotoAlbum, PhotoItem } from "@/types";
import { ASPECT_CLASS, GalleryGrid } from "@/components/photography/GalleryGrid";
import { Lightbox } from "@/components/photography/Lightbox";
import { Pagination } from "@/components/photography/Pagination";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const PHOTOS_PER_PAGE = 24;

interface AlbumPageContentProps {
  album: PhotoAlbum;
  photos: PhotoItem[];
}

export function AlbumPageContent({ album, photos }: AlbumPageContentProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Cover: the album's showcase image, else its featured/first photo. A cover that
  // is not part of the album becomes a virtual first lightbox item.
  const fallback = photos.find((photo) => photo.featured) ?? photos[0] ?? null;
  const coverImage = album.coverImage ?? fallback?.image ?? null;
  const coverPhoto = useMemo<PhotoItem | null>(() => {
    if (!coverImage) return fallback;
    return (
      photos.find((photo) => photo.image === coverImage) ?? {
        id: `cover-${album.slug}`,
        title: `${album.title} showcase`,
        category: album.category,
        albumSlug: album.slug,
        imageSeed: album.slug,
        image: coverImage,
        aspectRatio: album.coverAspectRatio,
      }
    );
  }, [album, coverImage, fallback, photos]);

  const lightboxPhotos = useMemo(
    () => (coverPhoto && !photos.includes(coverPhoto) ? [coverPhoto, ...photos] : photos),
    [coverPhoto, photos],
  );

  const totalPages = Math.max(1, Math.ceil(photos.length / PHOTOS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagePhotos = photos.slice((safePage - 1) * PHOTOS_PER_PAGE, safePage * PHOTOS_PER_PAGE);

  const open = (photo: PhotoItem | null) => {
    if (!photo) return;
    const index = lightboxPhotos.findIndex((item) => item.id === photo.id);
    if (index >= 0) setLightboxIndex(index);
  };

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages));
    requestAnimationFrame(() => galleryRef.current?.scrollIntoView({ block: "start" }));
  };

  return (
    <>
      <Container className="py-10 sm:py-14">
        <Link href="/photography" className="label inline-flex min-h-11 items-center gap-2 text-ink-muted hover:text-primary">
          <ArrowLeft aria-hidden className="h-4 w-4" /> Photography
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-5">
            {album.category.trim().toLowerCase() !== album.title.trim().toLowerCase() ? (
              <p className="label text-ink-muted">{album.category}</p>
            ) : null}
            <h1 className="display mt-2 text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.98] [overflow-wrap:anywhere]">{album.title}</h1>
            {album.description ? <p className="mt-4 max-w-prose leading-relaxed text-ink-muted">{album.description}</p> : null}
            <p className="label mt-4 text-ink-muted">{photos.length} frames</p>
          </div>

          {coverPhoto?.image ? (
            <button
              type="button"
              onClick={() => open(coverPhoto)}
              className={cn(
                "relative block w-full cursor-zoom-in overflow-hidden rounded-none bg-surface-2 lg:col-span-7",
                ASPECT_CLASS[coverPhoto.aspectRatio],
              )}
              aria-label={`Open ${coverPhoto.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverPhoto.image} alt={coverPhoto.title} className="h-full w-full object-cover" />
            </button>
          ) : null}
        </div>
      </Container>

      <div ref={galleryRef} className="scroll-mt-[var(--header-height)] border-t border-line py-10 sm:py-14">
        <Container>
          {photos.length ? (
            <>
              <GalleryGrid key={safePage} photos={pagePhotos} onPhotoClick={(photo) => open(photo)} />
              <Pagination page={safePage} totalPages={totalPages} totalItems={photos.length} pageSize={PHOTOS_PER_PAGE} onPageChange={goToPage} />
            </>
          ) : (
            <p className="text-ink-muted">No photos in this album yet.</p>
          )}
        </Container>
      </div>

      <Lightbox photos={lightboxPhotos} activeIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
    </>
  );
}
