import { useLocale, useTranslations } from "next-intl";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";
import { Frame } from "@/components/frame";
import { Divider } from "@/components/ui/divider";

// Gabarit des pages légales (/legal-notice, /privacy-policy) : en-tête (titre, date de mise à
// jour), puis le texte avec la mise en forme du texte riche (.prose-content), sur 70 % de large.
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  const t = useTranslations("Legal");
  const locale = useLocale();
  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      <Frame as="div" className="py-6">
        <h1 className="text-lg leading-tight font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted">
          {t("lastUpdated")} <time dateTime={site.legal.updated}>{formatDate(site.legal.updated, locale)}</time>
        </p>
      </Frame>

      <Divider />

      <Frame as="div" className="py-6">
        <div className="prose-content sm:w-[70%]">{children}</div>
      </Frame>

      <Divider />
    </main>
  );
}
