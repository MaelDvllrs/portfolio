"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocaleAlternates } from "@/components/locale-alternates";

// Nom de chaque langue dans sa propre langue
const NAMES: Record<string, string> = { en: "English", fr: "Français" };

// Sélecteur de langue en liste déroulante : bouton « EN ▾ » (langue courante), puis la liste des
// langues, chacune un vrai lien vers la même page dans cette langue (slugs traduits compris ;
// le choix est retenu par next-intl dans le cookie NEXT_LOCALE). Se ferme au clic à l'extérieur
// et avec Échap. `placement="up"` : la liste s'ouvre vers le haut, alignée à gauche (bas du menu mobile).
export function LocaleSwitcher({ className = "", placement = "down" }: { className?: string; placement?: "down" | "up" }) {
  const locale = useLocale();
  const t = useTranslations("Nav");
  const pathname = usePathname(); // chemin sans la langue (ex. « /blog »)
  // pages aux slugs traduits : chemin de la page dans chaque langue (déclaré par la page)
  const alternates = useLocaleAlternates();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

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

  return (
    <div ref={rootRef} className={`relative text-xs font-medium ${className}`}>
      <button
        type="button"
        aria-label={t("language")}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 uppercase text-muted transition-colors hover:text-foreground aria-expanded:text-foreground"
      >
        {locale}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`size-3 transition-transform ${open !== (placement === "up") ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* liste toujours dans le DOM (liens visibles pour les moteurs) ; masquée et inerte si fermée */}
      <ul
        id={listId}
        inert={!open}
        className={`absolute z-20 min-w-32 rounded-lg border border-border bg-background p-1 shadow-lg transition-opacity ${
          placement === "up" ? "bottom-full left-0 mb-1.5" : "top-full right-0 mt-1.5"
        } ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {routing.locales.map((l) => (
          <li key={l}>
            <Link
              href={alternates?.[l] ?? pathname}
              locale={l}
              hrefLang={l}
              aria-current={l === locale ? "true" : undefined}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-surface ${
                l === locale ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {NAMES[l] ?? l}
              <span className="text-xs uppercase text-muted">{l}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
