"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { MonitorIcon, MoonIcon, SunIcon } from "@/components/ui/icons";

type Theme = "light" | "dark" | "system";

// libellés traduits (messages Theme.light / dark / system)
const OPTIONS = [
  { value: "light", Icon: SunIcon },
  { value: "dark", Icon: MoonIcon },
  { value: "system", Icon: MonitorIcon },
] as const;

// Le choix est stocké dans localStorage ("light" | "dark" ; absent = system) et appliqué via
// l'attribut data-theme de <html> (voir le script d'init dans app/layout.tsx).
const EVENT = "themechange";

function readTheme(): Theme {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

function setTheme(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", theme);
  } catch {}
  if (theme === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", theme);
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback); // changement depuis un autre onglet
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function ThemeSwitch() {
  // côté serveur on ne connaît pas le choix : "system" par défaut, corrigé à l'hydratation
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme);
  const t = useTranslations("Theme");

  return (
    <div role="radiogroup" aria-label={t("label")} className="inline-flex rounded-lg border border-border p-0.5">
      {OPTIONS.map(({ value, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={t(value)}
          title={t(value)}
          onClick={() => setTheme(value)}
          className={`flex size-6 items-center justify-center rounded-md transition-colors ${
            theme === value ? "bg-surface text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          <Icon className="size-3" />
        </button>
      ))}
    </div>
  );
}
