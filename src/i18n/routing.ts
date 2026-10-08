import { defineRouting } from "next-intl/routing";

// Langues du site : chaque page existe en /en/… et /fr/… (préfixe toujours présent, meilleur
// pour le SEO : une URL par langue). « / » redirige selon la langue du navigateur (puis le
// cookie NEXT_LOCALE une fois une langue choisie) ; anglais par défaut.
export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
