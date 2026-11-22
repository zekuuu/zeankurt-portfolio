/** Flat skeleton in the bento shape; shown only during client navigation. */
export default function Loading() {
  return (
    <main id="main-content" aria-busy="true" className="grid gap-1.5 p-1.5 lg:grid-cols-12">
      <span className="sr-only" role="status">
        Loading
      </span>
      <div className="h-80 animate-pulse rounded-tile bg-surface-2 motion-reduce:animate-none lg:col-span-8" />
      <div className="h-80 animate-pulse rounded-tile bg-surface-2 motion-reduce:animate-none lg:col-span-4" />
      <div className="h-40 animate-pulse rounded-tile bg-surface-2 motion-reduce:animate-none lg:col-span-12" />
    </main>
  );
}
