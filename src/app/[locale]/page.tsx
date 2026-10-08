import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";
import { Divider } from "@/components/ui/divider";
import { Clients } from "@/components/sections/clients";
import { GitHub } from "@/components/sections/github";
import { Work } from "@/components/sections/work";
import { About } from "@/components/sections/about";
import { Stack } from "@/components/sections/stack";
import { Contact } from "@/components/sections/contact";
import { Blog } from "@/components/sections/blog";
import { Services } from "@/components/sections/services";

// Accueil : métadonnées du layout + liens hreflang vers /en et /fr
export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: localeAlternates(locale, "") };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="flex-1">
      <Hero />
      <Divider />
      <Work />
      <Clients />
      <Divider />
      <About />
      <GitHub />
      <Divider />
      <Stack />
      <Divider />
      <Services />
      <Blog />
      <Contact />
      <Divider />
    </main>
  );
}
