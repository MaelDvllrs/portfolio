import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { Clients } from "@/components/sections/clients";
import { Work } from "@/components/sections/work";
import { WhatIBuild } from "@/components/sections/what-i-build";
import { About } from "@/components/sections/about";
import { Stack } from "@/components/sections/stack";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Clients />
        <Work />
        <WhatIBuild />
        <About />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
