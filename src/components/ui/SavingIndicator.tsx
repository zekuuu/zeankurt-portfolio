"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Upload, X } from "lucide-react";
import { useSaving } from "@/lib/saving";

function formatRemainingTime(ms: number | null | undefined) {
  if (typeof ms !== "number" || !Number.isFinite(ms) || ms <= 0) {
    return null;
  }

  const totalSeconds = Math.max(1, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0 ? `${hours}h left` : `${hours}h ${remainingMinutes}m left`;
  }

  if (minutes >= 1) {
    return seconds === 0 ? `${minutes}m left` : `${minutes}m ${seconds}s left`;
  }

  return `${seconds}s left`;
}

export function SavingIndicator() {
  const { tasks, setSaving } = useSaving();
  const activeTasks = [...tasks].reverse();

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[1200] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence initial={false}>
        {activeTasks.map((task) => {
          const isUpload = (task.savingLabel ?? "").toLowerCase().includes("upload");
          const hasProgress = isUpload && typeof task.progressPercent === "number" && typeof task.totalCount === "number";
          const totalUploaded = task.totalCount ?? 0;
          const remainingLabel = formatRemainingTime(task.estimatedRemainingMs);

          return (
            <motion.aside
              key={task.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto rounded-tile border border-line bg-surface px-4 py-3"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-tile border border-primary bg-surface-2 text-primary">
                  {isUpload ? <Upload className="h-4 w-4" /> : <LoaderCircle className="h-4 w-4 animate-spin" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">
                      {isUpload ? "Upload in progress" : "Saving in progress"}
                    </p>
                    {hasProgress ? (
                      <span className="rounded-full border border-primary bg-surface-2 px-2 py-1 text-xs font-semibold text-primary">
                        {task.progressPercent}%
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                    {task.savingLabel ?? "Please wait for the current action to finish."}
                  </p>
                  {hasProgress ? (
                    <>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
                        <motion.div
                          className="h-full rounded-full bg-surface"
                          animate={{ width: `${task.progressPercent}%` }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-ink-muted">
                        {Math.min(task.completedCount ?? 0, totalUploaded)} of {totalUploaded} uploaded
                      </p>
                      {remainingLabel ? (
                        <p className="mt-1 text-xs text-ink-muted">
                          Estimated time remaining: {remainingLabel}
                        </p>
                      ) : null}
                    </>
                  ) : null}
                  {isUpload ? (
                    <p className="mt-2 text-xs text-primary">
                      Safe to close the modal
                    </p>
                  ) : null}
                  {isUpload && task.cancelAction ? (
                    <button
                      type="button"
                      onClick={() => {
                        task.cancelAction?.();
                        setSaving(false, null, undefined, task.id);
                      }}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-semibold text-ink transition hover:bg-block-orange hover:text-on-block"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel upload
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.aside>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
