import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates, localizedPaths } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { permanentRedirect } from "@/i18n/navigation";
import { LocaleAlternates } from "@/components/locale-alternates";
import Image from "next/image";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { findSlugInOtherLocales, getProjects, getService, getServices, getSlugsById } from "@/lib/cms";
import { Frame } from "@/components/frame";
import { Section, SectionTitle } from "@/components/section";
import { RichTextWithToc } from "@/components/rich-text-with-toc";
import { Faq, faqJsonLd } from "@/components/faq";
import { ServiceCard } from "@/components/service-card";
import { ServiceIllustration } from "@/components/service-illustrations";
import { WhatCanIBuild } from "@/components/what-can-i-build";
import { WorkSlider } from "@/components/sections/work-slider";
import { Divider } from "@/components/ui/divider";
import { ButtonLink } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { BackLink } from "@/components/ui/back-link";
import { PrevNext } from "@/components/ui/prev-next";
import { BRANDS } from "@/components/ui/brands";
import { Clients } from "@/components/sections/clients";
import { Contact } from "@/components/sections/contact";

// Pages générées au build pour chaque service publié ; un slug inconnu est rendu à la demande
// (service publié depuis), sinon 404.
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const services = await getServices(params.locale as Locale);
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getService(slug, locale as Locale);
  if (!service) return {};
  const paths = localizedPaths("/services", await getSlugsById("services", service.id));
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: localeAlternates(locale, paths),
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      images: service.cover ? [service.cover.url] : undefined,
    },
  };
}

// Page d'un service : retour au hub, hero (illustration ou couverture en fond, nom, résumé et
// bouton de contact par-dessus avec un fondu), outils, logos clients, points clés, « What can I build »,
// réalisations liées (slider), explication complète avec le menu des h3, FAQ, autres services puis le contact.
export default async function ServicePage({ params }: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [t, common] = await Promise.all([getTranslations("Services"), getTranslations("Common")]);
  const l = locale as Locale;
  const [service, services, projects] = await Promise.all([getService(slug, l), getServices(l), getProjects(l)]);
  if (!service) {
    // slug d'une autre langue (ex. ancien lien, changement de langue) → bonne URL dans cette langue (308)
    const other = await findSlugInOtherLocales("services", slug, l);
    if (other) permanentRedirect({ href: `/services/${other}`, locale });
    notFound();
  }
  const paths = localizedPaths("/services", await getSlugsById("services", service.id));

  // réalisations liées au service, dans l'ordre choisi dans le CMS (projets publiés seulement)
  const related = service.projectIds.flatMap((id) => projects.find((p) => p.id === id) ?? []);

  const index = services.findIndex((s) => s.id === service.id);
  // « More services » : les deux services suivants (en boucle), sans le service courant ni doublon
  const more = [...new Set([1, 2].map((k) => services[(index + k) % services.length]))].filter(
    (s) => s.id !== service.id,
  );

  // Données structurées (schema.org Service) pour les moteurs de recherche
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    image: service.cover?.url,
    url: `${site.url}/${locale}/services/${service.slug}`,
    provider: { "@type": "Person", name: site.name, url: site.url },
  };

  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      <LocaleAlternates paths={paths} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {service.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd(service.faq)).replace(/</g, "\\u003c"),
          }}
        />
      )}

      {/* retour au hub à gauche ; à droite, flèches vers le service précédent / suivant */}
      <Frame as="div" className="flex items-center justify-between gap-4 py-2">
        <BackLink href="/services">{t("allServices")}</BackLink>
        <PrevNext
          items={services.map((s) => ({ slug: s.slug, label: s.name }))}
          currentSlug={service.slug}
          basePath="/services"
          noun={t("noun")}
        />
      </Frame>

      {/* hero collé aux bordures de la colonne : illustration du service (sinon couverture) en
          fond, et par-dessus, en bas, le nom, le résumé et le bouton de contact, lisibles grâce
          à un fondu de la couleur du fond (comme les cartes service) */}
      <Frame as="div" bleed>
        <div className="relative flex aspect-[4/3] overflow-hidden bg-surface sm:aspect-[2/1]">
          {service.illustration ? (
            // calée dans le haut (le bas est occupé par le texte)
            <div className="absolute inset-x-0 top-0 bottom-1/4">
              <ServiceIllustration name={service.illustration} />
            </div>
          ) : (
            service.cover && (
              <Image
                src={service.cover.url}
                alt={service.cover.alt}
                fill
                sizes="(min-width: 50rem) 50rem, 100vw"
                loading="eager"
                fetchPriority="high"
                className="object-cover"
              />
            )
          )}

          {/* fondu de la couleur du fond, du bas vers le milieu */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-background via-background/85 to-transparent" />

          <div className="relative mt-auto flex w-full flex-col gap-3 px-4 pb-4 sm:flex-row sm:items-end sm:justify-between sm:px-5 sm:pb-5">
            <div className="max-w-xl">
              <h1 className="text-2xl leading-tight font-bold tracking-tight text-balance">{service.name}</h1>
              <p className="mt-2 text-sm text-muted">{service.summary}</p>
            </div>
            <ButtonLink href="/contact" variant="primary" size="sm" className="shrink-0 self-start sm:self-auto">
              {t("startProject")}
              <ArrowIcon className="size-3.5" />
            </ButtonLink>
          </div>
        </div>
      </Frame>

      {/* outils : leur propre rangée, la ligne du haut fait toute la largeur de la page */}
      {service.tools.length > 0 && (
        <Frame as="div" bleed>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-4 text-sm text-muted sm:px-5">
            {service.tools.map((tool) => (
              <li key={tool} className="flex items-center gap-2">
                {BRANDS[tool] && (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[1em]" aria-hidden>
                    <path d={BRANDS[tool].path} />
                  </svg>
                )}
                {tool}
              </li>
            ))}
          </ul>
        </Frame>
      )}

      {/* bandeau de logos clients, le même que sous « Selected work » sur l'accueil */}
      <Divider />
      <Clients />

      {/* points clés du service : 3 cases titre + texte (champ `highlights` du CMS), collées aux
          bordures de la section (cadre `bleed`) et séparées par des lignes verticales (lignes
          horizontales sur mobile, quand elles sont empilées) */}
      {service.highlights.length > 0 && (
        <>
          <Divider />
          <Frame as="div" bleed>
            <ul className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {service.highlights.map((item) => (
                <li key={item.title} className="flex flex-col gap-2 px-4 py-6 sm:px-5">
                  <h2 className="text-base leading-snug font-medium tracking-tight">{item.title}</h2>
                  <p className="text-sm text-muted">{item.text}</p>
                </li>
              ))}
            </ul>
          </Frame>
        </>
      )}

      {/* « What can I build » : textes qui défilent à gauche, visuel sticky à droite (champ
          `builds` du CMS) */}
      {service.builds.length > 0 && (
        <>
          <Divider />
          <section id="what-can-i-build" className="scroll-mt-20">
            <SectionTitle>{t("whatCanIBuild")}</SectionTitle>
            <Frame as="div" bleed>
              <WhatCanIBuild items={service.builds} />
            </Frame>
          </section>
        </>
      )}

      {/* réalisations liées au service : le même slider que « Selected work » sur l'accueil, sans boucle
          (overflow-hidden : les slides sont coupées aux bordures de la section) */}
      {related.length > 0 && (
        <>
          <Divider />
          <Section
            id="related-work"
            title={t("relatedWork")}
            action={{ label: common("viewAll"), href: "/work" }}
            className="overflow-hidden"
          >
            <WorkSlider projects={related} loop={false} />
          </Section>
        </>
      )}

      {/* explication complète : texte riche du champ `content` du CMS (converti en HTML par le
          CMS : champ contentHtml, contenu de confiance) */}
      {service.contentHtml && (
        <>
          <Divider />
          <Frame as="div" className="py-6">
            <article>
              <RichTextWithToc html={service.contentHtml} />
            </article>
          </Frame>
        </>
      )}

      {/* FAQ du service (questions remplies dans le CMS) */}
      {service.faq.length > 0 && (
        <section id="faq" className="scroll-mt-20">
          <SectionTitle>{common("faq")}</SectionTitle>
          {/* bleed : lignes de la FAQ d'une bordure à l'autre, sans padding de section */}
          <Frame as="div" bleed>
            <Faq items={service.faq} />
          </Frame>
        </section>
      )}

      {more.length > 0 && (
        <>
          <Divider />
          <section id="more-services" className="scroll-mt-20">
            <SectionTitle action={{ label: common("viewAll"), href: "/services" }}>{t("moreServices")}</SectionTitle>
            <Frame as="div" className="py-6">
              <ul className="grid gap-6 sm:grid-cols-2">
                {more.map((s) => (
                  <li key={s.id}>
                    <ServiceCard service={s} heading="h3" showSummary={false} />
                  </li>
                ))}
              </ul>
            </Frame>
          </section>
        </>
      )}

      <Divider />
      <Contact />
      <Divider />
    </main>
  );
}
