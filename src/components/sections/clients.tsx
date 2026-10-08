import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getClientLogos } from "@/lib/cms";
import { Frame } from "@/components/frame";
import { LogoGrid } from "./logo-grid";

// Rangée de logos sous « Selected work » (même cadre que les sections) : logos statiques, clients du CMS
// et logos des projets publiés (voir getClientLogos).
export async function Clients() {
  const [logos, t] = await Promise.all([getClientLogos((await getLocale()) as Locale), getTranslations("Home")]);
  return (
    <Frame aria-label={t("clients")} bleed>
      <LogoGrid logos={logos} />
    </Frame>
  );
}
