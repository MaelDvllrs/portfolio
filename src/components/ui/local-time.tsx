"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

// Heure actuelle d'un fuseau, mise à jour en direct, au format de la langue de la page :
// 12 h en anglais (« 2:32 PM »), 24 h en français (« 14:32 »).
// La page est pré-rendue : l'heure du HTML serveur peut être périmée. suppressHydrationWarning
// garde le rendu sans erreur d'hydratation, puis l'effet la corrige aussitôt dans le navigateur.
const format = (timeZone: string, locale: string) =>
  new Date().toLocaleTimeString(locale === "fr" ? "fr-FR" : "en-US", {
    hour: locale === "fr" ? "2-digit" : "numeric",
    minute: "2-digit",
    hour12: locale !== "fr",
    timeZone,
  });

export function LocalTime({ timeZone }: { timeZone: string }) {
  const locale = useLocale();
  const [time, setTime] = useState(() => format(timeZone, locale));

  useEffect(() => {
    const update = () => setTime(format(timeZone, locale));
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, [timeZone, locale]);

  return (
    <time suppressHydrationWarning className="tabular-nums">
      {time}
    </time>
  );
}
