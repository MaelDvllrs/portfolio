import Image from "next/image";
import Link from "next/link";
import type { WorkProject } from "@/lib/cms";
import { BRANDS } from "@/components/ui/brands";

// Carte de la page /work : photo de couverture en haut avec le logo, puis titre, type,
// description, puis les outils utilisés (logos seuls) et la période. Toute la carte mène à la page du projet.
export function WorkHubCard({
  project,
  placeholder,
  sizes = "(min-width: 50rem) 21rem, 85vw",
  coverClassName = "aspect-video",
}: {
  project: WorkProject;
  placeholder: string;
  /** Largeur affichée de la couverture (attribut sizes de next/image) ; défaut : grille à 2 colonnes */
  sizes?: string;
  /** Format de la couverture ; défaut 16/9 */
  coverClassName?: string;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      // lueur au survol : dégradé radial depuis le bas (couleur du texte) qui apparaît en fondu derrière le contenu
      className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-background p-4 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(130%_90%_at_50%_100%,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent_75%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100"
    >
      {/* Couverture (16/9 par défaut), dans le même padding que le texte et arrondie partout ;
          logo en haut à gauche, sur un léger dégradé pour rester lisible */}
      <div className={`relative overflow-hidden rounded-md text-white ${coverClassName} ${placeholder}`}>
        {project.image && (
          <Image
            src={project.image.url}
            alt={project.image.alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          {project.logo ? (
            // hauteur fixe, largeur selon le logo (carré ou horizontal)
            <Image src={project.logo.url} alt={project.logo.alt} width={120} height={24} className="h-6 w-auto" />
          ) : (
            <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 text-xs font-medium backdrop-blur-md">
              {project.name[0]}
            </span>
          )}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-base font-medium tracking-tight">{project.name}</h2>
          {project.type && <span className="shrink-0 text-xs text-muted">{project.type}</span>}
        </div>

        {project.description && <p className="line-clamp-2 text-sm text-muted">{project.description}</p>}

        {/* bas de carte (mt-auto : aligné d'une carte à l'autre) : outils à gauche, période à droite */}
        {(project.tools.length > 0 || project.period) && (
          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
            <ul className="flex flex-wrap items-center gap-3 text-muted">
              {project.tools.map((tool) => {
                const brand = BRANDS[tool];
                return (
                  // logo seul (nom en infobulle et pour les lecteurs d'écran) ; nom en texte si pas de logo
                  <li key={tool} title={tool}>
                    {brand ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" role="img" aria-label={tool}>
                        <path d={brand.path} />
                      </svg>
                    ) : (
                      <span className="text-xs">{tool}</span>
                    )}
                  </li>
                );
              })}
            </ul>
            {project.period && <span className="shrink-0 text-xs text-muted">{project.period}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
