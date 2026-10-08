import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy-policy">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return pageMetadata({
    locale,
    title: `${t("privacyTitle")} — ${site.name}`,
    description: t("privacyDescription"),
    paths: "/privacy-policy",
    ogTitle: t("privacyTitle"),
  });
}

// Politique de confidentialité (RGPD). Décrit le fonctionnement réel du site : Google Analytics
// seulement après consentement (cookie-consent.tsx) ; formulaire de contact envoyé par email via
// Resend ; thème et choix des cookies stockés en localStorage ; grille des contributions GitHub
// chargée depuis une API tierce ; embeds tiers éventuels dans les articles.
// À mettre à jour si un de ces points change (dans les deux langues).
export default async function PrivacyPolicyPage({ params }: PageProps<"/[locale]/privacy-policy">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  return <LegalPage title={t("privacyTitle")}>{locale === "fr" ? <French /> : <English />}</LegalPage>;
}

const { publisher, host } = site.legal;
const email = <a href={`mailto:${publisher.email}`}>{publisher.email}</a>;
const cnil = (
  <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
    CNIL
  </a>
);

function English() {
  return (
    <>
      <p>
        This policy explains which personal data is collected on this website, why, and what your rights are under the
        General Data Protection Regulation (GDPR). In short: audience measurement only if you agree, no advertising, and
        the data you send me is only used to answer you.
      </p>

      <h2>Data controller</h2>
      <p>
        {publisher.name}, {publisher.address}. Contact: {email}.
      </p>

      <h2>Contact form</h2>
      <p>
        When you use the <Link href="/contact">contact form</Link>, your name, email address and message are sent to me
        by email so I can reply to you. The legal basis is your consent and my legitimate interest in answering your
        request. These messages are not stored in a database; they are kept in my mailbox for as long as needed to
        follow up on your request, and for no more than 3 years after our last exchange.
      </p>
      <p>
        Emails are sent through <strong>Resend</strong> (Resend, Inc., United States), which acts as a processor. Data
        transfers to the United States are covered by the EU–US Data Privacy Framework and/or standard contractual
        clauses.
      </p>

      <h2>Audience measurement (Google Analytics)</h2>
      <p>
        If you accept it in the cookie banner, this website uses <strong>Google Analytics 4</strong> (Google Ireland
        Limited / Google LLC) to understand how it is used: pages visited, time spent, approximate location (country,
        city), device and browser, and how you arrived on the site. The legal basis is your consent. Google Analytics is
        not loaded at all if you decline or until you make a choice.
      </p>
      <p>
        Google Analytics sets cookies (<code>_ga</code>, <code>_ga_*</code>) valid for up to 13 months. Collected data is
        kept for 14 months, then deleted. Google may process data in the United States; these transfers are covered by
        the EU–US Data Privacy Framework and standard contractual clauses. More information in{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
          Google&apos;s privacy policy
        </a>
        .
      </p>
      <p>
        Your choice is remembered for 6 months. You can change it at any time with the <strong>Cookie settings</strong>{" "}
        link at the bottom of every page; withdrawing your consent deletes the Google Analytics cookies.
      </p>

      <h2>Local storage</h2>
      <p>
        Your choice of language, of light or dark theme and your cookie choice are saved in your browser only (local
        storage and a language cookie). They never leave your device except to show you the site in your language, and
        can be cleared from your browser settings.
      </p>

      <h2>Third-party content</h2>
      <ul>
        <li>
          The GitHub contributions chart is loaded by your browser from a public API (github-contributions-api.jogruber.de),
          which receives your IP address as part of any web request.
        </li>
        <li>
          Some articles may embed content from other services (for example a YouTube video). These services may collect
          data or set cookies according to their own privacy policies.
        </li>
        <li>
          Share buttons and &quot;Summarize with AI&quot; links are simple links: nothing is sent to these services
          unless you click them.
        </li>
      </ul>

      <h2>Hosting and technical logs</h2>
      <p>
        The website is hosted by {host.name}. Like any web server, it may temporarily record technical data (IP address,
        browser, pages requested) to ensure security and proper operation.
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to access, rectify and erase your data, to restrict or object to its processing, and to data
        portability. To exercise these rights, write to {email}. If you believe your rights are not respected, you can
        lodge a complaint with the French data protection authority, the {cnil}.
      </p>
    </>
  );
}

function French() {
  return (
    <>
      <p>
        Cette politique explique quelles données personnelles sont collectées sur ce site, pourquoi, et quels sont vos
        droits au titre du Règlement général sur la protection des données (RGPD). En bref : une mesure d&apos;audience
        seulement si vous l&apos;acceptez, aucune publicité, et les données que vous m&apos;envoyez servent uniquement à
        vous répondre.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        {publisher.name}, {publisher.address}. Contact : {email}.
      </p>

      <h2>Formulaire de contact</h2>
      <p>
        Lorsque vous utilisez le <Link href="/contact">formulaire de contact</Link>, votre nom, votre adresse email et
        votre message me sont envoyés par email pour que je puisse vous répondre. La base légale est votre consentement
        et mon intérêt légitime à répondre à votre demande. Ces messages ne sont pas enregistrés dans une base de
        données ; ils sont conservés dans ma messagerie le temps nécessaire au suivi de votre demande, et au plus 3 ans
        après notre dernier échange.
      </p>
      <p>
        Les emails sont envoyés via <strong>Resend</strong> (Resend, Inc., États-Unis), qui agit en tant que
        sous-traitant. Les transferts de données vers les États-Unis sont encadrés par le Data Privacy Framework UE–États-Unis
        et/ou des clauses contractuelles types.
      </p>

      <h2>Mesure d&apos;audience (Google Analytics)</h2>
      <p>
        Si vous l&apos;acceptez dans le bandeau cookies, ce site utilise <strong>Google Analytics 4</strong> (Google
        Ireland Limited / Google LLC) pour comprendre comment il est utilisé : pages visitées, temps passé, localisation
        approximative (pays, ville), appareil et navigateur, et provenance de la visite. La base légale est votre
        consentement. Google Analytics n&apos;est pas chargé du tout si vous refusez ou tant que vous n&apos;avez pas
        fait de choix.
      </p>
      <p>
        Google Analytics dépose des cookies (<code>_ga</code>, <code>_ga_*</code>) valables 13 mois au maximum. Les
        données collectées sont conservées 14 mois, puis supprimées. Google peut traiter des données aux États-Unis ;
        ces transferts sont encadrés par le Data Privacy Framework UE–États-Unis et des clauses contractuelles types.
        Plus d&apos;informations dans la{" "}
        <a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noreferrer">
          politique de confidentialité de Google
        </a>
        .
      </p>
      <p>
        Votre choix est conservé 6 mois. Vous pouvez le modifier à tout moment avec le lien{" "}
        <strong>Paramètres des cookies</strong> en bas de chaque page ; retirer votre consentement supprime les cookies
        de Google Analytics.
      </p>

      <h2>Stockage local</h2>
      <p>
        Votre choix de langue, de thème clair ou sombre et votre choix concernant les cookies sont enregistrés uniquement
        dans votre navigateur (stockage local et cookie de langue). Ils ne quittent pas votre appareil, sauf pour vous
        afficher le site dans votre langue, et peuvent être effacés depuis les réglages de votre navigateur.
      </p>

      <h2>Contenus tiers</h2>
      <ul>
        <li>
          La grille des contributions GitHub est chargée par votre navigateur depuis une API publique
          (github-contributions-api.jogruber.de), qui reçoit votre adresse IP comme pour toute requête web.
        </li>
        <li>
          Certains articles peuvent intégrer des contenus d&apos;autres services (par exemple une vidéo YouTube). Ces
          services peuvent collecter des données ou déposer des cookies selon leurs propres règles.
        </li>
        <li>
          Les boutons de partage et les liens « Résumer avec une IA » sont de simples liens : rien n&apos;est envoyé à
          ces services tant que vous ne cliquez pas.
        </li>
      </ul>

      <h2>Hébergement et journaux techniques</h2>
      <p>
        Le site est hébergé par {host.name}. Comme tout serveur web, il peut enregistrer temporairement des données
        techniques (adresse IP, navigateur, pages demandées) pour assurer la sécurité et le bon fonctionnement du site.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;effacement de vos données, d&apos;un droit
        à la limitation et d&apos;opposition à leur traitement, ainsi que d&apos;un droit à la portabilité. Pour les
        exercer, écrivez à {email}. Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une
        réclamation à la {cnil}.
      </p>
    </>
  );
}
