/**
 * Flat skeleton for admin navigation. Kept out of the public routes on purpose:
 * a root loading.tsx wraps static pages in Suspense, so without JS visitors
 * would only ever see this skeleton.
 */
export default function Loading() {
  return (
    <main aria-busy="true" className="grid gap-1.5 p-1.5 lg:grid-cols-12">
      <span className="sr-only" role="status">
        Loading
      </span>
      <div className="h-80 animate-pulse rounded-tile bg-surface-2 motion-reduce:animate-none lg:col-span-8" />
      <div className="h-80 animate-pulse rounded-tile bg-surface-2 motion-reduce:animate-none lg:col-span-4" />
      <div className="h-40 animate-pulse rounded-tile bg-surface-2 motion-reduce:animate-none lg:col-span-12" />
    </main>
  );
}
