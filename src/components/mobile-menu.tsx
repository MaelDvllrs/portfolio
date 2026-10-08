"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

// Menu burger (petits écrans) : bouton à 2 barres qui se transforme en croix, et panneau qui
// arrive de la droite sous la barre de navigation (le header reste visible au-dessus), avec les
// liens de la nav en haut et le bouton Contact (même style que sur grand écran) en bas.
// Se ferme avec le même bouton, Échap ou au clic sur un lien ; bloque le défilement de la page
// tant qu'il est ouvert.
export function MobileMenu({ links }: { links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);
  const bar = "absolute h-px w-5 bg-foreground transition-transform duration-300 ease-out";

  return (
    <>
      {/* 2 barres → croix : elles se rejoignent au centre et pivotent */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="relative -mr-2 flex size-10 items-center justify-center"
      >
        <span className={`${bar} ${open ? "rotate-45" : "-translate-y-[3.5px]"}`} />
        <span className={`${bar} ${open ? "-rotate-45" : "translate-y-[3.5px]"}`} />
      </button>

      <div
        id={panelId}
        aria-label="Menu"
        // fermé : hors écran à droite et inerte (ni focus ni lecteur d'écran)
        inert={!open}
        // sous la barre du header (3.5rem + sa bordure basse) ; hauteur en dvh : suit la zone
        // réellement visible sur mobile (barres du navigateur comprises), le bas reste à l'écran
        className={`fixed inset-x-0 top-[calc(3.5rem+1px)] flex h-[calc(100dvh-3.5rem-1px)] flex-col bg-background transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav aria-label="Mobile" className="flex-1 px-8 py-8">
          <ul className="flex flex-col gap-2">
            {links.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className="block py-1 text-3xl font-medium tracking-tight">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-8 pb-8">
          <ButtonLink href="/contact" variant="primary" onClick={close} className="w-full">
            Contact
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
