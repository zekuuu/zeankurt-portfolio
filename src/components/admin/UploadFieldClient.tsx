"use client";

import React from "react";
import { buildUploadMetricMap, formatBytes } from "@/components/admin/uploadMetrics";
import { fileInputClass } from "@/components/ui/field";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export default function UploadField({
  label,
  name,
  accept,
  multiple = false,
  directory = false,
}: {
  label: string;
  name: string;
  accept: string;
  multiple?: boolean;
  directory?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [metrics, setMetrics] = React.useState<Record<string, { originalBytes: number; optimizedBytes: number | null }>>({});

  React.useEffect(() => {
    let cancelled = false;

    if (selectedFiles.length === 0) {
      setMetrics({});
      return () => {
        cancelled = true;
      };
    }

    buildUploadMetricMap(selectedFiles).then((nextMetrics) => {
      if (!cancelled) {
        setMetrics(nextMetrics);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedFiles]);

  React.useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handler = () => {
      const files = input.files ? Array.from(input.files) : [];
      setSelectedFiles(files);
      const tooLargeCount = files.filter((f) => f.size > MAX_UPLOAD_BYTES).length;

      if (tooLargeCount > 0) {
        setNotice(
          `${tooLargeCount} file${tooLargeCount === 1 ? "" : "s"} exceed ${Math.round(
            MAX_UPLOAD_BYTES / 1024 / 1024,
          )}MB before optimization. Upload will still be attempted.`,
        );
        return;
      }

      setNotice(null);
    };

    input.addEventListener("change", handler);
    return () => input.removeEventListener("change", handler);
  }, []);

  return (
    <label className="rounded-none border border-dashed border-line bg-surface-2 px-4 py-3 text-xs font-medium text-ink-muted">
      {label}
      <input
        ref={inputRef}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        {...(directory ? { webkitdirectory: "" } : {})}
        className={`mt-2 block ${fileInputClass}`}
      />
      {notice ? <span className="mt-2 block text-[11px] text-primary">{notice}</span> : null}
      {selectedFiles.length > 0 ? (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file) => {
            const key = `${file.name}-${file.size}`;
            const metric = metrics[key];

            return (
              <div key={key} className="rounded-none border border-line bg-surface-2 px-3 py-2">
                <div className="truncate text-sm text-ink">{file.name}</div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-muted">
                  <span>Original: {formatBytes(file.size)}</span>
                  <span>Optimized: {metric ? formatBytes(metric.optimizedBytes) : "Estimating..."}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </label>
  );
}
