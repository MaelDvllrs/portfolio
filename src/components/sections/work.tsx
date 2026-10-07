import { site } from "@/content/site";
import { Section } from "@/components/section";
import { getProjects } from "@/lib/cms";
import { WorkSlider } from "./work-slider";

// Les projets viennent du CMS Payload (voir src/lib/cms.ts), avec repli sur le contenu statique
export async function Work() {
  const projects = await getProjects();
  return (
    // overflow-hidden sur le cadre : les slides sont coupées aux bordures de la section,
    // pas au padding du contenu
    <Section id="work" title={site.work.title} action={{ label: "View all", href: "/work" }} className="overflow-hidden">
      <WorkSlider projects={projects} />
    </Section>
  );
}
