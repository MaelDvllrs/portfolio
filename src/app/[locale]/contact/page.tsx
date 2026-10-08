import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { site } from "@/content/site";
import { Frame } from "@/components/frame";
import { SectionTitle } from "@/components/section";
import { ContactForm } from "@/components/contact-form";
import { Divider } from "@/components/ui/divider";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return {
    title: `${t("title")} — ${site.name}`,
    description: t("intro"),
    alternates: localeAlternates(locale, "/contact"),
  };
}

// Page de contact : en-tête (titre, intro), puis le formulaire.
export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContactPage");
  const contactPage = { title: t("title"), intro: t("intro") };

  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      <Frame as="div" className="py-6">
        <h1 className="text-lg leading-tight font-bold">{contactPage.title}</h1>
        <p className="mt-2 max-w-md text-sm text-muted">{contactPage.intro}</p>
      </Frame>

      <Divider />

      <section id="form" className="scroll-mt-20">
        <SectionTitle>{t("formTitle")}</SectionTitle>
        <Frame as="div" className="py-6">
          <ContactForm />
        </Frame>
      </section>

      <Divider />
    </main>
  );
}
