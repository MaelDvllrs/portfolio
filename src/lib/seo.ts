import { routing } from "@/i18n/routing";

// URL canonique et liens hreflang d'une page, pour ses métadonnées (alternates) :
// - canonical : la version de la langue courante ;
// - languages : une entrée par langue + « x-default » (version par défaut, anglais).
// `paths` : chemin de la page sans langue (« /blog », « » pour l'accueil), commun à toutes les
// langues, ou un chemin par langue (slugs traduits).
export function localeAlternates(locale: string, paths: string | Record<string, string>) {
  const pathFor = (l: string) => (typeof paths === "string" ? paths : (paths[l] ?? paths[routing.defaultLocale]));
  return {
    canonical: `/${locale}${pathFor(locale)}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${pathFor(l)}`])),
      "x-default": `/${routing.defaultLocale}${pathFor(routing.defaultLocale)}`,
    },
  };
}

/** Chemins d'une page par langue à partir de ses slugs traduits : { en: "/blog/a", fr: "/blog/b" } */
export function localizedPaths(base: string, slugs: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(slugs).filter(([, slug]) => slug).map(([l, slug]) => [l, `${base}/${slug}`]));
}
