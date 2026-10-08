import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { MobileMenu } from "@/components/mobile-menu";
import { GitHubStar } from "@/components/github-star";

const nav = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
];

// Barre fixe et fine, de la largeur de la colonne (même grille que Frame : px-2 > max-w-content) :
// fond de la couleur de la page sur toute la largeur de l'écran, bordures verticales aux bords de
// la colonne ; la ligne du bas fait toute la largeur.
// Logo à gauche ; à droite, les liens, le bouton « Star » GitHub, puis Contact (grand écran) ou le
// menu burger (petit écran).
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background px-2 text-foreground">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between border-x border-border px-6">
        <Link href="/" aria-label={site.name} className="flex items-center gap-2">
          <Logo className="h-6 w-auto" />
          <span className="text-sm font-medium tracking-tight">trymael</span>
        </Link>

        <div className="flex items-center gap-6 max-sm:hidden">
          <nav className="flex gap-6 text-sm">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="opacity-80 transition-opacity hover:opacity-100">
                {item.label}
              </Link>
            ))}
          </nav>
          {/* séparateurs verticaux courts entre les liens, GitHub et Contact */}
          <span aria-hidden className="h-4 w-px bg-border" />
          <GitHubStar />
          <span aria-hidden className="h-4 w-px bg-border" />
          <ButtonLink href="/contact" variant="primary" size="sm">
            Contact
          </ButtonLink>
        </div>

        <div className="flex items-center gap-3 sm:hidden">
          <GitHubStar />
          <MobileMenu links={nav} />
        </div>
      </div>
    </header>
  );
}
