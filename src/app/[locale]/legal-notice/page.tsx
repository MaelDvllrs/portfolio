import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata({ params }: PageProps<"/[locale]/legal-notice">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return {
    title: `${t("legalNoticeTitle")} — ${site.name}`,
    description: t("legalNoticeDescription", { domain: site.url.replace(/^https?:\/\//, "") }),
    alternates: localeAlternates(locale, "/legal-notice"),
  };
}

// Mentions légales (loi française LCEN, art. 6) : éditeur, directeur de la publication, hébergeur,
// propriété intellectuelle. Les informations viennent de site.legal (src/content/site.ts).
// Texte long avec des liens : une version rédigée par langue (anglais / français).
export default async function LegalNoticePage({ params }: PageProps<"/[locale]/legal-notice">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  return <LegalPage title={t("legalNoticeTitle")}>{locale === "fr" ? <French /> : <English />}</LegalPage>;
}

const { publisher, host } = site.legal;
const hostDomain = host.website.replace(/^https?:\/\//, "");
const email = <a href={`mailto:${publisher.email}`}>{publisher.email}</a>;
const github = (
  <a href={`https://github.com/${site.repo}`} target="_blank" rel="noreferrer">
    GitHub
  </a>
);
const hostLink = (
  <a href={host.website} target="_blank" rel="noreferrer">
    {hostDomain}
  </a>
);

function English() {
  return (
    <>
      <h2>Publisher</h2>
      <p>
        This website is published by <strong>{publisher.name}</strong>, a private individual.
        <br />
        Address: {publisher.address}
        <br />
        Email: {email}
      </p>
      <p>
        Publication director: <strong>{publisher.name}</strong>.
      </p>

      <h2>Hosting</h2>
      <p>
        This website is hosted by <strong>{host.name}</strong>, {host.address}. Website: {hostLink}.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content on this website (texts, images, illustrations, logos, design and source code) is the property of{" "}
        {publisher.name}, unless stated otherwise. Brand names and logos of third-party tools and clients belong to their
        respective owners and are shown for information only. Any reproduction or reuse without prior written permission
        is prohibited.
      </p>
      <p>The source code of this website is published on {github} under the terms of its repository license.</p>

      <h2>Personal data</h2>
      <p>
        Information about how your personal data is handled is available in the{" "}
        <Link href="/privacy-policy">privacy policy</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        For any question about this website, use the <Link href="/contact">contact form</Link> or write to {email}.
      </p>
    </>
  );
}

function French() {
  return (
    <>
      <h2>Éditeur</h2>
      <p>
        Ce site est édité par <strong>{publisher.name}</strong>, particulier.
        <br />
        Adresse : {publisher.address}
        <br />
        Email : {email}
      </p>
      <p>
        Directeur de la publication : <strong>{publisher.name}</strong>.
      </p>

      <h2>Hébergement</h2>
      <p>
        Ce site est hébergé par <strong>{host.name}</strong>, {host.address}. Site web : {hostLink}.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus de ce site (textes, images, illustrations, logos, design et code source) est la
        propriété de {publisher.name}, sauf mention contraire. Les marques et logos des outils et clients cités
        appartiennent à leurs propriétaires respectifs et sont présentés à titre informatif. Toute reproduction ou
        réutilisation sans autorisation écrite préalable est interdite.
      </p>
      <p>Le code source de ce site est publié sur {github}, selon les conditions de la licence de son dépôt.</p>

      <h2>Données personnelles</h2>
      <p>
        Les informations sur le traitement de vos données personnelles sont disponibles dans la{" "}
        <Link href="/privacy-policy">politique de confidentialité</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question sur ce site, utilisez le <Link href="/contact">formulaire de contact</Link> ou écrivez à{" "}
        {email}.
      </p>
    </>
  );
}
