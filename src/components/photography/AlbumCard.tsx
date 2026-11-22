import Link from "next/link";
import type { PhotoAlbum } from "@/types";

interface AlbumCardProps {
  album: PhotoAlbum;
}

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/photography/${album.slug}`} className="group block min-w-0">
      <span className="relative block aspect-[4/3] overflow-hidden rounded-tile bg-surface-2">
        {album.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={album.coverImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
          />
        ) : null}
      </span>
      <span className="mt-2 flex items-baseline justify-between gap-3 px-1">
        <span className="display text-base [overflow-wrap:anywhere] group-hover:text-primary sm:text-lg">{album.title}</span>
        <span className="label shrink-0 text-ink-muted">{album.photoCount}</span>
      </span>
      {album.description ? (
        <span className="mt-1 line-clamp-2 block px-1 text-sm text-ink-muted">{album.description}</span>
      ) : null}
    </Link>
  );
}
