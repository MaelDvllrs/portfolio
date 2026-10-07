import { Hero } from "@/components/sections/hero";
import { Divider } from "@/components/ui/divider";
import { Clients } from "@/components/sections/clients";
import { GitHub } from "@/components/sections/github";
import { Work } from "@/components/sections/work";
import { About } from "@/components/sections/about";
import { Stack } from "@/components/sections/stack";
import { Contact } from "@/components/sections/contact";
import { Blog } from "@/components/sections/blog";

export default function Home() {
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
      <Blog />
      <Contact />
      <Divider />
    </main>
  );
}
