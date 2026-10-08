import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import Image from "next/image";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { getProject, getProjects } from "@/lib/cms";
import { RichTextWithToc } from "@/components/rich-text-with-toc";
import { Frame } from "@/components/frame";
import { Section, SectionTitle } from "@/components/section";
import { placeholderFor } from "@/components/project-card";
import { WorkHubCard } from "@/components/work-hub-card";
import { Divider } from "@/components/ui/divider";
import { ButtonLink } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { BackLink } from "@/components/ui/back-link";
import { PrevNext } from "@/components/ui/prev-next";
import { BRANDS } from "@/components/ui/brands";
import { Contact } from "@/components/sections/contact";

// Pages générées au build pour chaque projet publié ; un slug inconnu est rendu à la demande
// (projet publié depuis), sinon 404.
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const projects = await getProjects(params.locale as Locale);
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug, locale as Locale);
  if (!project) return {};
  return pageMetadata({
    locale,
    title: `${project.name} — ${site.name}`,
    description: project.description || undefined,
    paths: `/work/${project.slug}`,
    image: project.image,
    ogTitle: project.name,
  });
}

// Page d'un projet, façon profil (comme le hero de l'accueil) : bannière = couverture,
// logo en « photo de profil », puis nom, type, description, puis outils et période ;
// ensuite l'étude de cas (contenu du CMS), d'autres projets et le contact.
export default async function ProjectPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [t, common] = await Promise.all([getTranslations("Work"), getTranslations("Common")]);
  const [project, projects] = await Promise.all([getProject(slug, locale as Locale), getProjects(locale as Locale)]);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.id === project.id);
  // « More work » : les deux projets suivants (en boucle), sans le projet courant ni doublon
  const more = [...new Set([1, 2].map((k) => projects[(index + k) % projects.length]))].filter(
    (p) => p.id !== project.id,
  );

  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      {/* retour au hub à gauche ; à droite, flèches vers le projet précédent / suivant */}
      <Frame as="div" className="flex items-center justify-between gap-4 py-2">
        <BackLink href="/work">{t("allWork")}</BackLink>
        <PrevNext
          items={projects.map((p) => ({ slug: p.slug, label: p.name }))}
          currentSlug={project.slug}
          basePath="/work"
          noun={t("noun")}
        />
      </Frame>

      <Frame as="div" bleed>
        {/* bannière : la couverture du projet */}
        <div className={`relative aspect-[3/1] overflow-hidden ${placeholderFor(Math.max(index, 0))}`}>
          {project.image && (
            <Image
              src={project.image.url}
              alt={project.image.alt}
              fill
              sizes="(min-width: 50rem) 50rem, 100vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          )}
        </div>

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          {/* logo du projet en « photo de profil » : remonte sur la bannière, détaché par un anneau */}
          <div className="relative z-10 -mt-10 flex size-20 items-center justify-center rounded-2xl border border-border bg-background ring-4 ring-background sm:-mt-12 sm:size-24">
            {project.logo ? (
              <Image
                src={project.logo.url}
                alt={project.logo.alt}
                width={160}
                height={64}
                className="h-auto max-h-10 w-auto max-w-[75%] object-contain"
              />
            ) : (
              <span className="text-2xl font-medium">{project.name[0]}</span>
            )}
          </div>

          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg leading-tight font-bold">{project.name}</h1>
              {project.type && <p className="text-sm text-muted">{project.type}</p>}
            </div>
            {project.url && (
              <ButtonLink
                href={project.url}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
                size="sm"
                className="shrink-0"
              >
                {t("visit")}
                <ArrowIcon className="size-3.5 -rotate-45" />
              </ButtonLink>
            )}
          </div>

          {project.description && <p className="mt-4 max-w-xl text-sm leading-snug">{project.description}</p>}
        </div>
      </Frame>

      {/* outils à gauche, période à droite : leur propre rangée, la ligne du haut fait toute la
          largeur de la page */}
      {(project.tools.length > 0 || project.period) && (
        <Frame as="div" bleed>
          <div className="flex items-center justify-between gap-6 px-6 py-4 text-sm text-muted sm:px-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {project.tools.map((tool) => (
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
            {project.period && <span className="shrink-0">{project.period}</span>}
          </div>
        </Frame>
      )}

      {/* explication complète, juste sous les outils : texte riche du champ `content` du CMS
          (converti en HTML par le CMS : champ contentHtml, contenu de confiance) */}
      {project.contentHtml && (
        <Section id="overview" title={t("overview")}>
          <RichTextWithToc html={project.contentHtml} />
        </Section>
      )}

      <Divider />

      {more.length > 0 && (
        <section id="more-work" className="scroll-mt-20">
          <SectionTitle action={{ label: common("viewAll"), href: "/work" }}>{t("moreWork")}</SectionTitle>
          <Frame as="div" className="py-6">
            <ul className="grid gap-6 sm:grid-cols-2">
              {more.map((p) => (
                <li key={p.id}>
                  <WorkHubCard project={p} heading="h3" placeholder={placeholderFor(projects.indexOf(p))} />
                </li>
              ))}
            </ul>
          </Frame>
        </section>
      )}

      <Divider />
      <Contact />
      <Divider />
    </main>
  );
}
