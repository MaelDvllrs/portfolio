import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { site } from "@/content/site";
import { getPosts } from "@/lib/cms";
import { Frame } from "@/components/frame";
import { PostRow } from "@/components/post-row";
import { Divider } from "@/components/ui/divider";
import { Contact } from "@/components/sections/contact";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: `${t("title")} — ${site.name}`,
    description: t("intro"),
    alternates: localeAlternates(locale, "/blog"),
  };
}

// Liste des articles (CMS, collection `posts`), du plus récent au plus ancien.
export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, posts] = await Promise.all([getTranslations("Blog"), getPosts(locale as Locale)]);
  const blog = { title: t("title"), intro: t("intro") };

  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      <Frame as="div" className="py-6">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-lg leading-tight font-bold">{blog.title}</h1>
          <span className="text-sm text-muted">
            {t("count", { count: posts.length })}
          </span>
        </div>
        <p className="mt-2 max-w-md text-sm text-muted">{blog.intro}</p>
      </Frame>

      <Divider />

      <Frame as="div" className="py-6">
        {posts.length ? (
          <ul className="grid gap-6">
            {posts.map((post) => (
              <li key={post.id}>
                <PostRow post={post} />
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
