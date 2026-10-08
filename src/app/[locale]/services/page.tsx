import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { site } from "@/content/site";
import { getServices } from "@/lib/cms";
import { Frame } from "@/components/frame";
import { ServiceCard } from "@/components/service-card";
import { Divider } from "@/components/ui/divider";
import { Contact } from "@/components/sections/contact";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Services" });
  return pageMetadata({
    locale,
    title: `${t("title")} — ${site.name}`,
    description: t("intro"),
    paths: "/services",
    ogTitle: t("title"),
  });
}

// Hub des services (CMS, collection `services`, triés par `order`) : en-tête, cartes pleine
// largeur sur une colonne (chacune mène à la page du service), puis le CTA de contact.
export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, services] = await Promise.all([getTranslations("Services"), getServices(locale as Locale)]);
  const content = { title: t("title"), intro: t("intro") };

  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      <Frame as="div" className="py-6">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-lg leading-tight font-bold">{content.title}</h1>
          <span className="text-sm text-muted">
            {t("count", { count: services.length })}
          </span>
        </div>
        <p className="mt-2 max-w-md text-sm text-muted">{content.intro}</p>
      </Frame>

      <Divider />

      <Frame as="div" className="py-6">
        {services.length ? (
          <ul className="grid gap-6">
            {services.map((service) => (
              <li key={service.id}>
                <ServiceCard service={service} className="aspect-[4/3] sm:aspect-[3/1]" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-sm text-muted">{t("comingSoon")}</p>
        )}
      </Frame>

      <Divider />
      <Contact />
      <Divider />
    </main>
  );
}
