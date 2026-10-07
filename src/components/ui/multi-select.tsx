"use client";

import { useEffect, useId, useRef, useState } from "react";

export type MultiSelectOption = { value: string; label: string; icon?: React.ReactNode };

// Liste déroulante à choix multiples : bouton (libellé + nombre de choix actifs), puis
// panneau de cases à cocher. Se ferme au clic à l'extérieur et avec Échap.
export function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (value: string) =>
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
          selected.length ? "border-foreground/40 text-foreground" : "border-border text-muted hover:text-foreground"
        }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-[0.625rem] font-medium text-background">
            {selected.length}
          </span>
        )}
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          id={panelId}
          className="absolute top-full left-0 z-20 mt-1.5 max-h-72 min-w-48 overflow-y-auto rounded-lg border border-border bg-background p-1 shadow-lg"
        >
          {options.map((option) => (
            <li key={option.value}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-surface">
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  onChange={() => toggle(option.value)}
                  className="size-3.5 accent-foreground"
                />
                {option.icon}
                {option.label}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
