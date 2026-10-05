import { getClientLogos } from "@/lib/cms";
import { Frame } from "@/components/frame";
import { LogoGrid } from "./logo-grid";

// Rangée de logos sous « Selected work » (même cadre que les sections) : logos statiques, clients du CMS
// et logos des projets publiés (voir getClientLogos).
export async function Clients() {
  const logos = await getClientLogos();
  return (
    <Frame aria-label="Clients" bleed>
      <LogoGrid logos={logos} />
    </Frame>
  );
}
