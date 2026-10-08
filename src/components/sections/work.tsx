import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Section } from "@/components/section";
import { getProjects } from "@/lib/cms";
import { WorkSlider } from "./work-slider";

// Les projets viennent du CMS Payload (voir src/lib/cms.ts), avec repli sur le contenu statique
export async function Work() {
  const [t, common] = await Promise.all([getTranslations("Home"), getTranslations("Common")]);
  const projects = await getProjects((await getLocale()) as Locale);
  return (
    // overflow-hidden sur le cadre : les slides sont coupées aux bordures de la section,
    // pas au padding du contenu
    <Section id="work" title={t("selectedWork")} action={{ label: common("viewAll"), href: "/work" }} className="overflow-hidden">
      <WorkSlider projects={projects} />
    </Section>
  );
}
