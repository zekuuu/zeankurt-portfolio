/**
 * Admin navigation state: says what is loading instead of mimicking a layout.
 * Kept out of the public routes on purpose: a root loading.tsx wraps static
 * pages in Suspense, so without JS visitors would only ever see this.
 */
export default function Loading() {
  return (
    <main aria-busy="true" className="p-4 sm:p-6">
      <p role="status" className="label rounded-field border border-line px-4 py-3 text-ink-muted">
        Loading admin…
      </p>
    </main>
  );
}
