import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { routing, type Locale } from "@/i18n/routing";
import { getPosts, getProjects, getServices } from "@/lib/cms";

// Une page : son chemin dans chaque langue (identique, ou slugs traduits) + ses options de sitemap
type Entry = Omit<MetadataRoute.Sitemap[number], "url" | "alternates"> & { paths: Record<string, string> };

const same = (path: string) => Object.fromEntries(routing.locales.map((l) => [l, path]));

// Documents du CMS dans chaque langue, regroupés par id : chemin par langue (slugs traduits)
async function byId<T extends { id: string; slug: string }>(
  load: (locale: Locale) => Promise<T[]>,
  base: string,
): Promise<{ doc: T; paths: Record<string, string> }[]> {
  const lists = await Promise.all(routing.locales.map((l) => load(l)));
  return lists[0].map((doc) => ({
    doc,
    paths: Object.fromEntries(
      routing.locales.map((l, i) => [l, `${base}/${lists[i].find((d) => d.id === doc.id)?.slug ?? doc.slug}`]),
    ),
  }));
}

// /sitemap.xml : pages fixes, pages service, pages projet et articles (données du CMS, mêmes caches).
// Chaque page est listée dans chaque langue (/en/…, /fr/…), avec ses liens hreflang vers les autres
// versions (alternates.languages, dont « x-default » = anglais).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, posts] = await Promise.all([
    byId(getServices, "/services"),
    byId(getProjects, "/work"),
    byId(getPosts, "/blog"),
  ]);

  const pages: Entry[] = [
    { paths: same(""), changeFrequency: "monthly", priority: 1 },
    { paths: same("/services"), changeFrequency: "monthly", priority: 0.9 },
    { paths: same("/work"), changeFrequency: "monthly", priority: 0.8 },
    { paths: same("/blog"), changeFrequency: "weekly", priority: 0.8 },
    { paths: same("/contact"), changeFrequency: "yearly", priority: 0.5 },
    { paths: same("/legal-notice"), changeFrequency: "yearly", priority: 0.1 },
    { paths: same("/privacy-policy"), changeFrequency: "yearly", priority: 0.1 },
    ...services.map(({ paths }) => ({ paths, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.map(({ paths }) => ({ paths, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...posts.map(({ doc, paths }) => ({
      paths,
      lastModified: doc.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const url = (locale: string, path: string) => `${site.url}/${locale}${path}`;
  return pages.flatMap(({ paths, ...entry }) =>
    routing.locales.map((locale) => ({
      ...entry,
      url: url(locale, paths[locale]),
      alternates: {
        languages: {
          ...Object.fromEntries(routing.locales.map((l) => [l, url(l, paths[l])])),
          "x-default": url(routing.defaultLocale, paths[routing.defaultLocale]),
        },
      },
    })),
  );
}
