"use client";

import React from "react";
import { useSaving } from "@/lib/saving";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  loadingLabel?: string;
  savingKey?: string;
};

export default function SaveButton({
  children,
  className = "",
  loadingLabel = "Saving...",
  savingKey,
  ...rest
}: Props) {
  const { isSaving } = useSaving(savingKey);

  return (
    <button
      {...rest}
      disabled={isSaving || rest.disabled}
      className={`min-h-11 cursor-pointer rounded-none bg-primary px-4 py-2 text-sm font-medium text-on-primary hover-fill hover-fill-no-primary disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isSaving ? (
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span>{loadingLabel}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
