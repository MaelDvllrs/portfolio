import Image from "next/image";
import Link from "next/link";
import type { WorkProject } from "@/lib/cms";

// Fonds de remplacement tant que les projets n'ont pas d'image
const PLACEHOLDER_BACKGROUNDS = [
  "bg-[linear-gradient(135deg,#1c1917,#44403c)]",
  "bg-[linear-gradient(135deg,#0f172a,#334155)]",
  "bg-[linear-gradient(135deg,#18181b,#52525b)]",
];
export const placeholderFor = (index: number) => PLACEHOLDER_BACKGROUNDS[index % PLACEHOLDER_BACKGROUNDS.length];

// Carte projet 16/9 (image, logo, type, nom) : slider de l'accueil et hub /work
export function ProjectCard({
  project,
  placeholder,
  sizes = "(min-width: 50rem) 32rem, 85vw",
}: {
  project: WorkProject;
  placeholder: string;
  /** Largeur affichée de l'image (attribut sizes de next/image) */
  sizes?: string;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`relative block aspect-video overflow-hidden rounded-2xl text-white ${placeholder}`}
    >
      {project.image && (
        <Image
          src={project.image.url}
          alt={project.image.alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      )}
      {/* Dégradé sombre de gauche (logo, titre) vers transparent à droite */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />

      {/* Logo en haut à gauche */}
      <div className="absolute top-5 left-5">
        {project.logo ? (
          // hauteur fixe, largeur selon le logo (carré ou horizontal)
          <Image src={project.logo.url} alt={project.logo.alt} width={120} height={24} className="h-6 w-auto" />
        ) : (
          // TODO : remplacer par le vrai logo
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 text-xs font-medium backdrop-blur-md">
            {project.name[0]}
          </span>
        )}
      </div>

      {/* En bas à gauche : pin avec le type, puis le titre */}
      <div className="absolute bottom-5 left-5 flex flex-col items-start gap-2">
        {project.type && (
          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[0.6875rem] font-medium backdrop-blur-md">
            {project.type}
          </span>
        )}
        <h3 className="text-lg font-medium sm:text-xl">{project.name}</h3>
      </div>
    </Link>
  );
}
