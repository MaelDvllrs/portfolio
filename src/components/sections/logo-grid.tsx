"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ClientLogo } from "@/lib/cms";

const CELLS = 6; // cases sur grand écran (3 sur mobile)
const INTERVAL = 5000; // ms entre deux changements
const STAGGER = 120; // ms de décalage d'une case à l'autre

// Rangée de logos fixe : toutes les INTERVAL ms, chaque case passe au logo suivant.
// L'ancien logo part vers le haut en se floutant, le nouveau arrive par le bas en devenant net,
// en décalé d'une case à l'autre (vague). Logos en silhouette monochrome (--logo-filter).
export function LogoGrid({ logos }: { logos: ClientLogo[] }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (logos.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTick((t) => t + 1), INTERVAL);
    return () => clearInterval(id);
  }, [logos.length]);

  if (!logos.length) return null;
  // Case i, au tour t. Avec plus de logos que de cases, chaque tour avance d'une rangée entière
  // (toute la liste défile) ; sinon d'un cran, pour que chaque case change bien de logo.
  const step = logos.length > CELLS ? CELLS : 1;
  const logoAt = (cell: number, t: number) => logos[(cell + t * step) % logos.length];

  return (
    <ul className="grid grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: CELLS }, (_, cell) => {
        const current = logoAt(cell, tick);
        const previous = tick > 0 ? logoAt(cell, tick - 1) : null;
        const delay = cell * STAGGER;
        return (
          <li
            key={cell}
            className={`relative h-28 overflow-hidden border-border not-last:border-r sm:h-32 max-lg:nth-3:border-r-0 ${
              cell >= 3 ? "max-lg:hidden" : ""
            }`}
          >
            {/* la clé change à chaque tour : les animations CSS repartent de zéro */}
            {previous && previous.id !== current.id && (
              <Logo key={`out-${tick}`} logo={previous} className="animate-logo-out" delay={delay} />
            )}
            <Logo
              key={`in-${tick}`}
              logo={current}
              className={tick > 0 ? "animate-logo-in" : ""}
              delay={delay + 150}
            />
          </li>
        );
      })}
    </ul>
  );
}

function Logo({ logo, className, delay }: { logo: ClientLogo; className: string; delay: number }) {
  return (
    // l'animation (translation + flou) est sur le conteneur : le filtre silhouette reste sur l'image
    <span
      className={`absolute inset-0 flex items-center justify-center ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Image
        src={logo.logo.url}
        alt={logo.logo.alt || logo.name}
        width={200}
        height={48}
        className="h-9 w-auto max-w-[65%] object-contain opacity-60 [filter:var(--logo-filter)]"
      />
    </span>
  );
}
