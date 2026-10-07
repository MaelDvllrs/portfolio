import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";

const nav = [
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/#about" },
];

// Barre fixe et fine, de la largeur de la colonne (même grille que Frame : px-2 > max-w-content) :
// fond de la couleur de la page, bordures sur les côtés ; la ligne du bas fait toute la largeur.
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border px-2 text-foreground">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between border-x border-border bg-background px-6">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label={site.name} className="flex items-center gap-2">
            <Logo className="h-6 w-auto" />
            <span className="text-sm font-medium tracking-tight">trymael</span>
          </Link>
          {/* liens masqués sur petit écran : il ne reste que le logo et Contact */}
          <nav className="flex gap-6 text-sm max-sm:hidden">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="opacity-80 transition-opacity hover:opacity-100">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <ButtonLink href="/#contact" variant="primary" size="sm">
          Contact
        </ButtonLink>
      </div>
    </header>
  );
}
