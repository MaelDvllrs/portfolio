import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { Clients } from "@/components/sections/clients";
import { Work } from "@/components/sections/work";
import { WhatIBuild } from "@/components/sections/what-i-build";
import { About } from "@/components/sections/about";
import { Stack } from "@/components/sections/stack";
import { Contact } from "@/components/sections/contact";
import { ParticleField } from "@/components/particle-field";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Work />
        <Clients />
        <WhatIBuild />
        <About />
        <Stack />
        <Contact />
      </main>
      <Footer />
      {/* particules qui voyagent de section en section */}
      <ParticleField />
    </>
  );
}
