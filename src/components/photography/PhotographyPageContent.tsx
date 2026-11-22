"use client";

import { useMemo, useRef, useState } from "react";
import type { SiteConfig } from "@/types/site";
import { socialGroups } from "@/data/social";
import { cn } from "@/lib/cn";
import { buildPhotoCategories, buildPhotographyAlbums, buildPhotographyPhotos } from "@/lib/photography";
import { AlbumCard } from "@/components/photography/AlbumCard";
import { GalleryGrid } from "@/components/photography/GalleryGrid";
import { Lightbox } from "@/components/photography/Lightbox";
import { Pagination } from "@/components/photography/Pagination";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { CreativeCategory } from "@/types";

const PHOTOS_PER_PAGE = 24;

interface PhotographyPageContentProps {
  creativeCategories: CreativeCategory[];
  siteConfig: SiteConfig;
}

export function PhotographyPageContent({ creativeCategories, siteConfig }: PhotographyPageContentProps) {
  const galleryRef = useRef<HTMLElement>(null);
  const albums = useMemo(() => buildPhotographyAlbums(creativeCategories), [creativeCategories]);
  const categories = useMemo(() => buildPhotoCategories(creativeCategories), [creativeCategories]);
  const photos = useMemo(() => buildPhotographyPhotos(creativeCategories), [creativeCategories]);

  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = category === "All" ? photos : photos.filter((photo) => photo.category === category);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PHOTOS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagePhotos = filtered.slice((safePage - 1) * PHOTOS_PER_PAGE, safePage * PHOTOS_PER_PAGE);

  const selectCategory = (next: string) => {
    setCategory(next);
    setPage(1);
    setLightboxIndex(null);
  };

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages));
    setLightboxIndex(null);
    requestAnimationFrame(() => galleryRef.current?.scrollIntoView({ block: "start" }));
  };

  return (
    <>
      <Container className="grid gap-6 py-10 sm:py-14 lg:grid-cols-12 lg:items-end">
        <div className="min-w-0 lg:col-span-8">
          <p className="label text-ink-muted">{siteConfig.photographyBrand}</p>
          <h1 className="display mt-3 text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.98] [overflow-wrap:anywhere]">
            Photography & visual stories from events, portraits, and the streets.
          </h1>
        </div>
        <div className="lg:col-span-4">
          <p className="leading-relaxed text-ink-muted">
            Work published under <strong className="font-medium text-ink">shot.by.zk</strong> and produced with{" "}
            <strong className="font-medium text-ink">Studio Nomads</strong>, covering community events, campus
            activations, and editorial shoots.
          </p>
          <SocialLinks links={socialGroups.photography} showLabels className="mt-4" />
        </div>
      </Container>

      <section id="albums" aria-labelledby="albums-title" className="border-t border-line py-10 sm:py-14">
        <Container>
          <p className="label text-ink-muted">Albums</p>
          <h2 id="albums-title" className="display mt-2 text-3xl">
            Collections
          </h2>
          {albums.length ? (
            <div className="mt-6 grid grid-cols-2 gap-x-1.5 gap-y-6 lg:grid-cols-3 2xl:grid-cols-4">
              {albums.map((album) => (
                <AlbumCard key={album.slug} album={album} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-ink-muted">No photography categories are published yet.</p>
          )}
        </Container>
      </section>

      <section ref={galleryRef} aria-labelledby="gallery-title" className="scroll-mt-[var(--header-height)] border-t border-line py-10 sm:py-14">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label text-ink-muted">Gallery</p>
              <h2 id="gallery-title" className="display mt-2 text-3xl">
                All frames <span className="label align-middle text-ink-muted">({filtered.length})</span>
              </h2>
            </div>
            {photos.length ? (
              <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
                {categories.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={category === option}
                    onClick={() => selectCategory(option)}
                    className={cn(
                      "label inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 transition-colors",
                      category === option ? "hover-fill hover-fill-no-primary border-primary bg-primary text-on-primary" : "hover-fill",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {filtered.length ? (
            <>
              <GalleryGrid
                key={`${category}-${safePage}`}
                className="mt-6"
                photos={pagePhotos}
                onPhotoClick={(photo) => setLightboxIndex(filtered.findIndex((item) => item.id === photo.id))}
              />
              <Pagination page={safePage} totalPages={totalPages} totalItems={filtered.length} pageSize={PHOTOS_PER_PAGE} onPageChange={goToPage} />
            </>
          ) : (
            <p className="mt-6 text-ink-muted">No published photos available yet.</p>
          )}
        </Container>
      </section>

      <Lightbox photos={filtered} activeIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
    </>
  );
}
