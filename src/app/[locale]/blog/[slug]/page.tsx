import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata, localizedPaths } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { permanentRedirect } from "@/i18n/navigation";
import { LocaleAlternates } from "@/components/locale-alternates";
import Image from "next/image";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { findSlugInOtherLocales, getPost, getPosts, getSlugsById } from "@/lib/cms";
import { readingTime } from "@/lib/rich-text";
import { formatDate } from "@/lib/format";
import { Frame } from "@/components/frame";
import { SectionTitle } from "@/components/section";
import { PostRow } from "@/components/post-row";
import { RichTextWithToc } from "@/components/rich-text-with-toc";
import { Faq, faqJsonLd } from "@/components/faq";
import { Divider } from "@/components/ui/divider";
import { BackLink } from "@/components/ui/back-link";
import { ShareLinks } from "@/components/share-links";
import { AiSummary } from "@/components/ai-summary";
import { PrevNext } from "@/components/ui/prev-next";
import { Contact } from "@/components/sections/contact";

// Pages générées au build pour chaque article publié ; un slug inconnu est rendu à la demande
// (article publié depuis), sinon 404.
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const posts = await getPosts(params.locale as Locale);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale as Locale);
  if (!post) return {};
  const paths = localizedPaths("/blog", await getSlugsById("posts", post.id));
  return pageMetadata({
    locale,
    title: post.metaTitle,
    description: post.metaDescription,
    paths,
    image: post.cover,
    ogTitle: post.title,
    ogSubtitle: post.excerpt,
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author?.name ?? site.name],
      tags: post.tags,
    },
  });
}

// Article : retour à la liste, en-tête (date, temps de lecture, titre, résumé, tags),
// couverture, contenu avec le menu des h3, FAQ, auteur et dates, puis d'autres articles et le contact.
export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [t, common] = await Promise.all([getTranslations("Blog"), getTranslations("Common")]);
  const l = locale as Locale;
  const [post, posts] = await Promise.all([getPost(slug, l), getPosts(l)]);
  if (!post) {
    // slug d'une autre langue (ex. ancien lien, changement de langue) → bonne URL dans cette langue (308)
    const other = await findSlugInOtherLocales("posts", slug, l);
    if (other) permanentRedirect({ href: `/blog/${other}`, locale });
    notFound();
  }
  const paths = localizedPaths("/blog", await getSlugsById("posts", post.id));
  const url = `${site.url}/${locale}/blog/${post.slug}`;

  const more = posts.filter((p) => p.id !== post.id).slice(0, 2);
  const updated =
    formatDate(post.updatedAt) !== formatDate(post.publishedAt) ? formatDate(post.updatedAt, locale) : null;

  // Données structurées (schema.org BlogPosting) pour les moteurs de recherche
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: post.cover?.url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: post.tags.join(", ") || undefined,
    // auteur lié dans le CMS, sinon le propriétaire du site
    author: {
      "@type": "Person",
      name: post.author?.name ?? site.name,
      jobTitle: post.author?.jobTitle ?? undefined,
      image: post.author?.avatar?.url,
      url: site.url,
    },
    mainEntityOfPage: url,
  };

  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      <LocaleAlternates paths={paths} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {post.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(post.faq)).replace(/</g, "\\u003c") }}
        />
      )}

      {/* retour à la liste à gauche ; à droite, flèches vers l'article précédent / suivant
          (mêmes boutons que le slider Work, à la hauteur du texte « All posts ») */}
      <Frame as="div" className="flex items-center justify-between gap-4 py-2">
        <BackLink href="/blog">{t("allPosts")}</BackLink>
        <PrevNext
          items={posts.map((p) => ({ slug: p.slug, label: p.title }))}
          currentSlug={post.slug}
          basePath="/blog"
          noun={t("noun")}
        />
      </Frame>

      <Frame as="div" className="py-6">
        <p className="text-xs text-muted">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time> ·{" "}
          {t("minRead", { minutes: readingTime(post.contentHtml) })}
        </p>
        <h1 className="mt-2 text-2xl leading-tight font-bold tracking-tight text-balance">{post.title}</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">{post.excerpt}</p>
        {post.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5 text-[0.6875rem] text-muted">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-border px-2 py-0.5">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </Frame>

      {/* couverture collée aux bordures de la colonne */}
      {post.cover && (
        <Frame as="div" bleed>
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.cover.url}
              alt={post.cover.alt}
              fill
              sizes="(min-width: 50rem) 50rem, 100vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
        </Frame>
      )}

      <Divider />

      {/* bandeau « résumer avec une IA » : sa propre rangée, avant le texte */}
      <Frame as="div" className="py-2">
        <AiSummary url={url} title={post.title} />
      </Frame>

      <Frame as="div" className="py-6">
        <article>
          {/* menu des titres h2 (les articles sont structurés en h2) */}
          <RichTextWithToc html={post.contentHtml} headingLevel={2} />
        </article>
      </Frame>

      {/* FAQ de l'article (questions remplies dans le CMS), en bas du contenu */}
      {post.faq.length > 0 && (
        <section id="faq" className="scroll-mt-20">
          <SectionTitle>{common("faq")}</SectionTitle>
          {/* bleed : lignes de la FAQ d'une bordure à l'autre, sans padding de section */}
          <Frame as="div" bleed>
            <Faq items={post.faq} />
          </Frame>
        </section>
      )}

      {/* bas d'article (sa propre rangée, ligne du haut pleine largeur) : auteur à gauche ; à droite,
          les liens de partage puis les dates de publication et de mise à jour */}
      <Frame as="div" className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
        {post.author ? (
          <div className="flex items-center gap-3">
            <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-surface">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar.url}
                  alt={post.author.avatar.alt || post.author.name}
                  fill
                  sizes="2.25rem"
                  className="object-cover"
                />
              )}
            </div>
            <div className="text-sm leading-tight">
              <p className="font-medium">{post.author.name}</p>
              {post.author.jobTitle && <p className="text-xs text-muted">{post.author.jobTitle}</p>}
            </div>
          </div>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ShareLinks url={url} title={post.title} />
          <span aria-hidden className="h-6 w-px bg-border max-sm:hidden" />
          <dl className="grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5 text-xs text-muted">
            <dt>{t("published")}</dt>
            <dd className="text-foreground">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
            </dd>
            {/* mise à jour : seulement si elle tombe un autre jour que la publication */}
            {updated && (
              <>
                <dt>{t("updated")}</dt>
                <dd className="text-foreground">
                  <time dateTime={post.updatedAt}>{updated}</time>
                </dd>
              </>
            )}
          </dl>
        </div>
      </Frame>

      {more.length > 0 && (
        <>
          <Divider />
          <section id="more-posts" className="scroll-mt-20">
            <SectionTitle action={{ label: common("viewAll"), href: "/blog" }}>{t("morePosts")}</SectionTitle>
            <Frame as="div" className="py-6">
              <ul className="grid gap-6">
                {more.map((p) => (
                  <li key={p.id}>
                    <PostRow post={p} heading="h3" />
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
