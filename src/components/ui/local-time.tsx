"use client";

import { useEffect, useState } from "react";

// Heure actuelle d'un fuseau (ex. « 14:32 » à Paris), mise à jour en direct.
// La page est pré-rendue : l'heure du HTML serveur peut être périmée. suppressHydrationWarning
// garde le rendu sans erreur d'hydratation, puis l'effet la corrige aussitôt dans le navigateur.
const format = (timeZone: string) =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });

export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState(() => format(timeZone));

  useEffect(() => {
    const update = () => setTime(format(timeZone));
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <time suppressHydrationWarning className="tabular-nums">
      {time}
    </time>
  );
}
