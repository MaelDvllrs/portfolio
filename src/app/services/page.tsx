import type { Metadata } from "next";
import { site } from "@/content/site";
import { getServices } from "@/lib/cms";
import { Frame } from "@/components/frame";
import { ServiceCard } from "@/components/service-card";
import { Divider } from "@/components/ui/divider";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: `Services — ${site.name}`,
  description: site.services.intro,
  alternates: { canonical: "/services" },
};

// Hub des services (CMS, collection `services`, triés par `order`) : en-tête, cartes pleine
// largeur sur une colonne (chacune mène à la page du service), puis le CTA de contact.
export default async function ServicesPage() {
  const { services: content } = site;
  const services = await getServices();

  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      <Frame as="div" className="py-6">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-lg leading-tight font-bold">{content.title}</h1>
          <span className="text-sm text-muted">
            {services.length} service{services.length === 1 ? "" : "s"}
          </span>
        </div>
        <p className="mt-2 max-w-md text-sm text-muted">{content.intro}</p>
      </Frame>

      <Divider />

      <Frame as="div" className="py-6">
        {services.length ? (
          <ul className="grid gap-6">
            {services.map((service) => (
              <li key={service.id}>
                <ServiceCard service={service} className="aspect-[4/3] sm:aspect-[3/1]" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-sm text-muted">Services coming soon.</p>
        )}
      </Frame>

      <Divider />
      <Contact />
      <Divider />
    </main>
  );
}
