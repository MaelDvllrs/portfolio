import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getServices } from "@/lib/cms";
import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { Divider } from "@/components/ui/divider";

// Services sur l'accueil : les 3 premiers, en bento — une grande carte à gauche (65 %) et deux
// petites empilées à droite, sans résumé (sur mobile : les unes sous les autres), lien vers /services.
// Rien n'est affiché tant qu'aucun service n'est publié (séparateur de fin compris, pour ne
// pas laisser deux séparateurs collés sur l'accueil).
export async function Services() {
  const [t, common] = await Promise.all([getTranslations("Home"), getTranslations("Common")]);
  const [first, ...others] = (await getServices((await getLocale()) as Locale)).slice(0, 3);
  if (!first) return null;

  return (
    <>
      <Section id="services" title={t("services")} action={{ label: common("viewAll"), href: "/services" }}>
        <ul className="grid gap-6 sm:grid-cols-[13fr_7fr]">
          {/* grande carte : sur les deux lignes, hauteur fixée par les deux petites */}
          <li className={others.length > 1 ? "sm:row-span-2" : undefined}>
            <ServiceCard service={first} heading="h3" className="aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-80" />
          </li>
          {others.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} heading="h3" showSummary={false} />
            </li>
          ))}
        </ul>
      </Section>
      <Divider />
    </>
  );
}
