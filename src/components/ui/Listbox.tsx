"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type ListboxOption = { label: string; value: string };

interface ListboxProps {
  /** Accessible name; shown visually only when `showLabel` is set. */
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ListboxOption[];
  /** When set, a hidden input carries the value in form posts. */
  name?: string;
  required?: boolean;
  placeholder?: string;
  showLabel?: boolean;
  className?: string;
}

/**
 * Themed replacement for the native <select>: the option list follows the
 * tokens instead of the OS. Keyboard: Enter/Space/ArrowDown open, arrows and
 * Home/End move, Enter selects, Esc or outside click closes, focus returns.
 */
export function Listbox({
  label,
  value,
  onChange,
  options,
  name,
  required,
  placeholder = "Select…",
  showLabel = false,
  className,
}: ListboxProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [active, setActive] = useState(Math.max(0, selectedIndex));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    listRef.current?.focus();
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const openList = () => {
    setActive(Math.max(0, selectedIndex));
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  };

  const onButtonKeyDown = (event: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openList();
    }
  };

  const onListKeyDown = (event: KeyboardEvent) => {
    const last = options.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(last, active + 1),
      ArrowUp: Math.max(0, active - 1),
      Home: 0,
      End: last,
    };
    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(active);
    } else if (event.key === "Escape" || event.key === "Tab") {
      event.preventDefault();
      close();
    } else if (event.key.length === 1) {
      // Type-ahead: jump to the next option starting with the typed letter.
      const key = event.key.toLowerCase();
      const next = options.findIndex((o, i) => i > active && o.label.toLowerCase().startsWith(key));
      const wrap = options.findIndex((o) => o.label.toLowerCase().startsWith(key));
      if (next >= 0 || wrap >= 0) setActive(next >= 0 ? next : wrap);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative min-w-0", className)}>
      {showLabel ? (
        <span id={`${id}-label`} className="label mb-2 block text-ink-muted">
          {label}
        </span>
      ) : null}
      {name ? <input type="hidden" name={name} value={value} required={required} /> : null}

      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={showLabel ? undefined : `${label}: ${selected?.label ?? placeholder}`}
        aria-labelledby={showLabel ? `${id}-label ${id}-value` : undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKeyDown}
        className={cn(
          "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-field border border-line bg-surface px-3 text-left text-sm text-ink transition-colors hover:bg-surface-2",
          open && "bg-surface-2",
        )}
      >
        <span id={`${id}-value`} className={cn("truncate", (!selected || !value) && "text-ink-muted")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden
          strokeWidth={1.75}
          className={cn("h-4 w-4 shrink-0 transition-transform duration-150", open && "rotate-180")}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKeyDown}
          data-lenis-prevent
          className="enter absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-72 overflow-y-auto rounded-field border border-line bg-surface p-1 text-sm"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${id}-opt-${index}`}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={cn(
                  "flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-[8px] px-3",
                  isSelected ? "bg-ink text-bg" : index === active ? "bg-surface-2 text-ink" : "text-ink",
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected ? <Check aria-hidden className="h-4 w-4 shrink-0" strokeWidth={2} /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
