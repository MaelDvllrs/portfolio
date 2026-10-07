import type { Metadata } from "next";
import { site } from "@/content/site";
import { Frame } from "@/components/frame";
import { SectionTitle } from "@/components/section";
import { ContactForm } from "@/components/contact-form";
import { Divider } from "@/components/ui/divider";

export const metadata: Metadata = {
  title: `Contact — ${site.name}`,
  description: site.contactPage.intro,
  alternates: { canonical: "/contact" },
};

// Page de contact : en-tête (titre, intro), puis le formulaire.
export default function ContactPage() {
  const { contactPage } = site;

  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      <Frame as="div" className="py-6">
        <h1 className="text-lg leading-tight font-bold">{contactPage.title}</h1>
        <p className="mt-2 max-w-md text-sm text-muted">{contactPage.intro}</p>
      </Frame>

      <Divider />

      <section id="form" className="scroll-mt-20">
        <SectionTitle>Send a message</SectionTitle>
        <Frame as="div" className="py-6">
          <ContactForm />
        </Frame>
      </section>

      <Divider />
    </main>
  );
}
