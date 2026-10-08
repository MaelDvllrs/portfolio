import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { site } from "@/content/site";

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

// Locale Open Graph (format langue_PAYS) de chaque langue du site
const OG_LOCALES: Record<string, string> = { en: "en_US", fr: "fr_FR" };

/** URL de l'image de partage générée (/api/og) pour une page sans photo */
export const ogImageUrl = (title: string, subtitle?: string) =>
  `/api/og?${new URLSearchParams({ title, ...(subtitle ? { subtitle } : {}) })}`;

type PageMetadataInput = {
  locale: string;
  /** Titre complet (balise <title>, og:title, twitter:title) */
  title: string;
  description?: string;
  /** Chemin(s) de la page sans langue, comme pour localeAlternates */
  paths: string | Record<string, string>;
  /** Photo de la page (couverture d'article, image de projet…) ; sinon image générée */
  image?: { url: string; alt?: string } | null;
  /** Titre et sous-titre de l'image générée (par défaut : titre et description) */
  ogTitle?: string;
  ogSubtitle?: string;
  /** Article de blog : type « article » + dates, auteurs et tags */
  article?: { publishedTime: string; modifiedTime: string; authors: string[]; tags: string[] };
};

/**
 * Métadonnées SEO complètes d'une page : titre, description, URL canonique et hreflang,
 * Open Graph (type, URL, nom du site, langue + autres langues, image 1200×630) et Twitter
 * (carte summary_large_image). Toujours une image : la photo de la page, sinon une image générée.
 */
export function pageMetadata({
  locale,
  title,
  description,
  paths,
  image,
  ogTitle,
  ogSubtitle,
  article,
}: PageMetadataInput): Metadata {
  const alternates = localeAlternates(locale, paths);
  const images = image
    ? [{ url: image.url, alt: image.alt || title }]
    : [{ url: ogImageUrl(ogTitle ?? title, ogSubtitle ?? description), width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: site.name,
      locale: OG_LOCALES[locale] ?? locale,
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l] ?? l),
      images,
      ...(article
        ? {
            type: "article",
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: article.authors,
            tags: article.tags,
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

/** Chemins d'une page par langue à partir de ses slugs traduits : { en: "/blog/a", fr: "/blog/b" } */
export function localizedPaths(base: string, slugs: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(slugs).filter(([, slug]) => slug).map(([l, slug]) => [l, `${base}/${slug}`]));
}
