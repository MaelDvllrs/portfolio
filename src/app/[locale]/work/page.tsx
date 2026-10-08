import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { site } from "@/content/site";
import { getProjects } from "@/lib/cms";
import { Frame } from "@/components/frame";
import { WorkHub } from "@/components/work-hub";
import { Divider } from "@/components/ui/divider";
import { Contact } from "@/components/sections/contact";

export async function generateMetadata({ params }: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Work" });
  return {
    title: `${t("title")} — ${site.name}`,
    description: t("intro"),
    alternates: localeAlternates(locale, "/work"),
  };
}

// Hub de tous les projets (mêmes données que « Selected work » : CMS, avec repli statique).
// En-tête de page, filtres + grille de cartes (WorkHub), puis le CTA de contact.
export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, projects] = await Promise.all([getTranslations("Work"), getProjects(locale as Locale)]);
  const workHub = { title: t("title"), intro: t("intro") };

  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      <Frame as="div" className="py-6">
        <h1 className="text-lg leading-tight font-bold">{workHub.title}</h1>
        <p className="mt-2 max-w-md text-sm text-muted">{workHub.intro}</p>
      </Frame>

      <WorkHub projects={projects} />

      <Divider />
      <Contact />
      <Divider />
    </main>
  );
}
