import { ArrowLeft, ArrowRight } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, totalItems, pageSize, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <nav aria-label="Gallery pages" className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
      <p className="label text-ink-muted">
        {start}–{end} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={buttonClass("secondary", "disabled:cursor-not-allowed disabled:opacity-40")}>
          <ArrowLeft aria-hidden className="h-4 w-4" /> Prev
        </button>
        <span className="label px-2" aria-current="page">
          {page} / {totalPages}
        </span>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={buttonClass("secondary", "disabled:cursor-not-allowed disabled:opacity-40")}>
          Next <ArrowRight aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
