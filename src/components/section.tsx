import { Frame } from "@/components/frame";
import { ArrowLink } from "@/components/ui/arrow-link";

// Style commun des titres de section : petit et discret
export const h2Class = "text-base font-medium tracking-tight text-balance";

// Bande du titre : sa propre rangée du cadre. La ligne sous le titre est la bordure haute
// (pleine largeur de la page) de la rangée suivante.
// `action` : lien discret à droite du titre (ex. « View all »).
export function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: { label: string; href: string };
}) {
  return (
    <Frame as="div" className="flex items-center justify-between gap-4 py-2">
      <h2 className={h2Class}>{children}</h2>
      {action && <ArrowLink href={action.href}>{action.label}</ArrowLink>}
    </Frame>
  );
}

// Titre, puis contenu. Padding vertical = padding horizontal du cadre (px-6) : py-6
export function Section({
  id,
  title,
  action,
  className = "",
  children,
}: {
  id: string;
  title: string;
  action?: { label: string; href: string };
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <SectionTitle action={action}>{title}</SectionTitle>
      <Frame as="div" className={`py-6 ${className}`}>
        {children}
      </Frame>
    </section>
  );
}
