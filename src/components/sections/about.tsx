import { site } from "@/content/site";
import { Frame } from "@/components/frame";
import { h2Class } from "@/components/section";
import { GlowLogo } from "@/components/ui/glow-logo";

// Titre centré en haut ; puis sous-titre + texte à gauche et le logo (contour) plus large à droite ;
// puis les chiffres sur une ligne.
export function About() {
  const { about } = site;
  return (
    // overflow-hidden : les faisceaux lumineux du logo sont coupés aux bordures de la section
    <Frame id="about" className="overflow-hidden pt-20 lg:pt-28">
      <h2 className={`${h2Class} text-center`}>{about.title}</h2>

      <div className="mt-16 grid gap-12 lg:grid-cols-5 lg:items-center lg:gap-16">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-normal tracking-tight">{about.subtitle}</h3>
          <div className="mt-6 space-y-2 text-base text-muted">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        {/* Logo en contour seul (couleur des bordures), qui brille au survol */}
        <div className="flex items-center justify-center lg:col-span-3">
          <GlowLogo className="w-full max-w-xl" />
        </div>
      </div>

      {/* Chiffres : cases carrées bordées, collées entre elles et aux bordures de la section
          (-mx-6 annule le padding du cadre), comme les étapes des services */}
      <dl className="-mx-6 mt-20 grid grid-cols-2 border-t border-border lg:grid-cols-4">
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
  );
}
