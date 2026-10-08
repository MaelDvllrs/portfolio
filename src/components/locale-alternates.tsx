"use client";

import { useEffect, useSyncExternalStore } from "react";

// Chemins d'une page dans chaque langue, quand ils diffèrent (slugs traduits des services et
// articles) : la page les déclare avec <LocaleAlternates>, le sélecteur de langue les lit avec
// useLocaleAlternates(). Sans déclaration, le sélecteur garde le même chemin dans l'autre langue.

type Paths = Record<string, string>;
let current: Paths | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useLocaleAlternates(): Paths | null {
  return useSyncExternalStore(subscribe, () => current, () => null);
}

/** Déclare les chemins de la page courante par langue (ex. { en: "/services/ai-tools", fr: "/services/outils-ia" }). */
export function LocaleAlternates({ paths }: { paths: Paths }) {
  const key = JSON.stringify(paths);
  useEffect(() => {
    current = JSON.parse(key) as Paths;
    emit();
    return () => {
      current = null;
      emit();
    };
  }, [key]);
  return null;
}
