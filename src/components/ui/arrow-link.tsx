import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/icons";

// Bouton texte : au repos, juste le texte ; au survol, le texte glisse un peu vers la gauche et
// une flèche apparaît à sa place en glissant vers la droite (fondu). Miroir : BackLink.
export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center text-sm text-muted transition-colors duration-300 hover:text-foreground focus-visible:text-foreground"
    >
      <span className="transition-transform duration-300 ease-out group-hover:-translate-x-5 group-focus-visible:-translate-x-5">
        {children}
      </span>
      <ArrowIcon className="absolute right-0 size-3.5 -translate-x-2 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
    </Link>
  );
}
