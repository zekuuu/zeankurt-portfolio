/**
 * Shared look for text inputs, textareas and date fields: flat surface, 1px
 * line border, field radius, 44px target. Focus uses the global ring.
 * Date fields keep the native picker, which follows the theme via color-scheme.
 */
export const fieldClass =
  "min-h-11 w-full rounded-field border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted";

/** Native file input: the browser's button styled like a secondary pill. */
export const fileInputClass =
  "text-sm text-ink-muted file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-full file:border file:border-solid file:border-line file:bg-transparent file:px-4 file:text-sm file:font-medium file:text-ink hover:file:bg-ink hover:file:text-bg";
