"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";

const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
];

// Barre fixe et fine : transparente (texte foncé, le haut du hero est clair) tout en haut ;
// dès qu'on scrolle, fond de la couleur de la page et fine bordure.
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b px-2 transition-colors duration-300 ${
        scrolled
          ? "border-border bg-background text-foreground"
          : "border-transparent bg-transparent text-neutral-950"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <a href="#" aria-label={site.name} className="flex items-center gap-2">
            <Logo className="h-6 w-auto" />
            <span className="text-sm font-medium tracking-tight">trymael</span>
          </a>
          <nav className="flex gap-6 text-sm">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="opacity-80 transition-opacity hover:opacity-100">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <ButtonLink href="#contact" variant="primary" size="sm">
          Contact
        </ButtonLink>
      </div>
    </header>
  );
}
