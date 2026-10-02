import { getClientLogos } from "@/lib/cms";
import { ClientsMarquee } from "./clients-marquee";

// Bandeau de logos sous le hero : clients ajoutés dans le CMS + logos des projets publiés
// (voir getClientLogos), avec repli sur des placeholders si le CMS n'est pas disponible.
export async function Clients() {
  const logos = await getClientLogos();
  return (
    // Pleine largeur : seulement la ligne du haut, sans marges ni bordures verticales
    <section aria-label="Clients" className="border-t border-border">
      <ClientsMarquee logos={logos} />
    </section>
  );
}
