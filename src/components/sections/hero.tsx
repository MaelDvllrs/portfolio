import Image from "next/image";
import { siWebflow } from "simple-icons";
import { site } from "@/content/site";
import { Frame } from "@/components/frame";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ClockIcon, PinIcon } from "@/components/ui/icons";
import { LocalTime } from "@/components/ui/local-time";
import { SOCIAL_ICONS } from "@/components/ui/social-icons";
import cover from "@/assets/image/couverture.png";
import avatar from "@/assets/image/profile.jpg";

// Badges à droite du nom. Logos en currentColor pour suivre le thème
// (Wenoble : tracés de src/assets/image/logo-wenoble.svg, blanc à l'origine).
const badges = [
  {
    label: "CTO & Co-founder Wenoble",
    viewBox: "0 0 420 289",
    paths: [
      "M0 288.082H39.3089L99.442 0.453125H59.8993L0 288.082Z",
      "M162.378 0L100.607 287.408L170.099 287.85L231.87 0.442846L162.378 0Z",
      "M290.374 0.666016L228.603 287.852L358.229 288.517L420 1.33029L290.374 0.666016Z",
    ],
  },
  { label: "Webflow Certified Partner", viewBox: "0 0 24 24", paths: [siWebflow.path] },
];

// En-tête façon profil de réseau social : bannière pleine largeur de la colonne,
// photo ronde qui déborde sur le bas de la bannière, puis nom, pseudo, bio et liens.
export function Hero() {
  const { profile } = site;

  return (
    <section id="hero">
      <Frame as="div" bleed className="pt-14">
        {/* bannière collée aux bordures de la colonne */}
        <div className="relative aspect-[3/1] overflow-hidden">
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 50rem) 50rem, 100vw"
            placeholder="blur"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        </div>

        <div className="px-6 pb-6">
          {/* la photo remonte de la moitié de sa hauteur sur la bannière (relative z-10 :
              peinte au-dessus de l'image, elle-même positionnée) ; l'anneau couleur de fond
              la détache de l'image */}
          <div className="relative z-10 -mt-14 size-28 overflow-hidden rounded-full bg-background ring-4 ring-background sm:-mt-20 sm:size-40 sm:ring-[6px]">
            <Image
              src={avatar}
              alt={site.name}
              sizes="10rem"
              placeholder="blur"
              loading="eager"
              className="size-full object-cover"
            />
          </div>

          {/* nom et pseudo à gauche ; rôle chez Wenoble et badge partenaire Webflow tout à droite, aligné sur le nom */}
          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-1 text-lg leading-tight font-bold">
                {profile.name}
                {/* pin « certifié » façon compte vérifié (icône Material « verified », coche évidée) */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-[1.1em] text-foreground" role="img" aria-label="Verified">
                  <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
                </svg>
              </h1>
              <p className="text-sm text-muted">{profile.handle}</p>
            </div>
            {/* grille logo | texte : les deux logos restent alignés en colonne */}
            <ul className="grid shrink-0 grid-cols-[1rem_auto] items-center gap-x-2 gap-y-1.5 pt-0.5 text-xs font-medium">
              {badges.map((b) => (
                <li key={b.label} className="contents">
                  <svg viewBox={b.viewBox} fill="currentColor" className="size-4" aria-hidden>
                    {b.paths.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                  <span>{b.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 text-sm leading-snug text-pretty sm:max-w-[40%]">
            {profile.bio.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          {/* localisation et heure locale (en direct) */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <PinIcon className="size-[1em]" />
              {profile.location}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="size-[1em]" />
              <LocalTime timeZone={profile.timeZone} />
            </span>
          </div>
        </div>
      </Frame>

      {/* réseaux à gauche, bouton Contact à droite : leur propre rangée du cadre, la ligne du haut
          fait toute la largeur de la page */}
      <Frame as="div" bleed>
        <div className="flex items-center justify-between gap-6 px-6 py-2.5">
          {/* icônes seules (nom en infobulle et pour les lecteurs d'écran) ; nom en texte si pas d'icône */}
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {site.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={l.label}
                  title={l.label}
                  className="block text-muted transition-colors hover:text-foreground"
                >
                  {SOCIAL_ICONS[l.label] ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
                      <path d={SOCIAL_ICONS[l.label]} />
                    </svg>
                  ) : (
                    l.label
                  )}
                </a>
              </li>
            ))}
          </ul>
          {/* vers la page de contact (formulaire) */}
          <ArrowLink href="/contact">Contact</ArrowLink>
        </div>
      </Frame>
    </section>
  );
}
