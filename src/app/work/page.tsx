import type { Metadata } from "next";
import { site } from "@/content/site";
import { getProjects } from "@/lib/cms";
import { Frame } from "@/components/frame";
import { WorkHub } from "@/components/work-hub";
import { Divider } from "@/components/ui/divider";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: `Work — ${site.name}`,
  description: site.workHub.intro,
};

// Hub de tous les projets (mêmes données que « Selected work » : CMS, avec repli statique).
// En-tête de page, filtres + grille de cartes (WorkHub), puis le CTA de contact.
export default async function WorkPage() {
  const { workHub } = site;
  const projects = await getProjects();

  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      <Frame as="div" className="py-6">
        <h1 className="text-lg leading-tight font-bold">{workHub.title}</h1>
        <p className="mt-2 max-w-md text-sm text-muted">{workHub.intro}</p>
      </Frame>

      <WorkHub projects={projects} />

      <Divider />
      <Contact />
      <Divider />
    </main>
  );
}
