import { site } from "@/content/site";
import { Frame } from "@/components/frame";
import { SectionTitle } from "@/components/section";
import { GlowLogo } from "@/components/ui/glow-logo";

// Titre en haut (bande pleine largeur) ; puis sous-titre + texte à gauche et le logo (contour) plus large à droite ;
// puis les chiffres sur une ligne.
export function About() {
  const { about } = site;
  return (
    <section id="about" className="scroll-mt-20">
      <SectionTitle>{about.title}</SectionTitle>
      {/* overflow-hidden : les faisceaux lumineux du logo sont coupés aux bordures de la section */}
      {/* bleed : les chiffres touchent les bordures ; le bloc texte + logo a le padding de la section */}
      <Frame as="div" bleed className="overflow-hidden">
        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <div>
            <h3 className="text-base font-medium tracking-tight">{about.subtitle}</h3>
            <div className="mt-2 space-y-2 text-sm text-muted">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>

          {/* Logo en contour seul (couleur des bordures), qui brille au survol */}
          {/* moitié de la section ; sur grand écran, hauteur du bloc texte : le logo est sorti
              du flux (absolute), c'est le texte qui fixe la hauteur de la rangée */}
          <div className="relative">
            <GlowLogo
              className="lg:absolute lg:inset-0 lg:flex lg:justify-center"
              svgClassName="h-auto w-full lg:h-full lg:w-auto"
            />
          </div>
        </div>

      </Frame>

      {/* Chiffres : cases carrées bordées, collées entre elles et aux bordures de la section.
          Leur propre rangée du cadre : la ligne du haut fait toute la largeur de la page. */}
      <Frame as="div" bleed>
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {about.stats.map((s) => (
            <div
              key={s.label}
              className="flex aspect-square flex-col items-center justify-center gap-4 border-border p-6 text-center max-lg:odd:border-r max-lg:nth-[-n+2]:border-b lg:not-last:border-r"
            >
              <dt className="order-last text-sm text-muted">{s.label}</dt>
              <dd className="text-6xl leading-none font-normal tracking-tight sm:text-7xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Frame>
    </section>
  );
}
