import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/icons";

// Lien de retour en bouton texte, miroir de « View all » (SectionTitle) : au survol, le texte
// glisse un peu vers la droite et une flèche apparaît à gauche en glissant vers la gauche.
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center text-sm text-muted transition-colors duration-300 hover:text-foreground focus-visible:text-foreground"
    >
      <ArrowIcon className="absolute left-0 size-3.5 translate-x-2 rotate-180 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
      <span className="transition-transform duration-300 ease-out group-hover:translate-x-5 group-focus-visible:translate-x-5">
        {children}
      </span>
    </Link>
  );
}
