import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/cms";
import { ServiceIllustration } from "@/components/service-illustrations";

// Carte de service (accueil et /services) : une grande carte avec l'illustration (ou à défaut la
// couverture) en fond, et le nom + résumé en bas à gauche, lisibles grâce à un fondu de la
// couleur du fond qui recouvre le bas de l'illustration. Lueur en bas au survol, comme /work.
// `className` : taille de la carte (par défaut 4/3 ; la grande carte de l'accueil prend toute la hauteur)
// `showSummary` : false pour les petites cartes de l'accueil (nom seul)
export function ServiceCard({
  service,
  className = "aspect-[4/3]",
  showSummary = true,
}: {
  service: Service;
  className?: string;
  showSummary?: boolean;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={`group relative flex overflow-hidden rounded-2xl border border-border bg-surface after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[radial-gradient(130%_90%_at_50%_100%,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent_75%)] after:opacity-0 after:transition-opacity after:duration-500 hover:after:opacity-100 ${className}`}
    >
      {/* fond : illustration calée dans le haut de la carte (le bas est occupé par le texte) */}
      {service.illustration ? (
        <div className="absolute inset-x-0 top-0 bottom-1/5">
          <ServiceIllustration name={service.illustration} />
        </div>
      ) : (
        service.cover && (
          <Image
            src={service.cover.url}
            alt={service.cover.alt}
            fill
            sizes="(min-width: 50rem) 21rem, 85vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )
      )}

      {/* fondu de la couleur du fond, du bas vers le milieu de la carte */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-background via-background/85 to-transparent" />

      <div className="relative mt-auto flex max-w-[85%] flex-col gap-1.5 p-5">
        <h2 className="text-base leading-snug font-medium tracking-tight">{service.name}</h2>
        {showSummary && <p className="line-clamp-3 text-sm text-muted">{service.summary}</p>}
      </div>
    </Link>
  );
}
