"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Splide from "@splidejs/splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/splide/css/core";
import type { ClientLogo } from "@/lib/cms";

// Nombre minimal de cases pour remplir les grands écrans : la liste est répétée si besoin
const MIN_ITEMS = 12;

// Bandeau de logos : défile en continu (AutoScroll), peut être déplacé à la main (drag),
// se met en pause au survol. Les logos sont affichés en silhouette monochrome (noire en clair,
// blanche en sombre, via --logo-filter) : discrets au repos, pleinement visibles au survol.
export function ClientsMarquee({ logos }: { logos: ClientLogo[] }) {
  const splideRef = useRef<HTMLDivElement>(null);
  const items = logos.length
    ? Array.from({ length: Math.ceil(MIN_ITEMS / logos.length) }, () => logos).flat()
    : [];

  useEffect(() => {
    if (!splideRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const splide = new Splide(splideRef.current, {
      type: "loop",
      drag: "free",
      focus: "center",
      fixedWidth: "10rem",
      gap: 0,
      arrows: false,
      pagination: false,
      autoScroll: { speed: 0.5, pauseOnHover: true, pauseOnFocus: false, autoStart: !reducedMotion },
    }).mount({ AutoScroll });

    return () => {
      splide.destroy();
    };
  }, []);

  return (
    <div ref={splideRef} className="splide">
      <div className="splide__track">
        <ul className="splide__list">
          {items.map((client, i) => (
            <li key={`${client.id}-${i}`} className="splide__slide">
              <div className="group flex aspect-square items-center justify-center border-r border-border">
                <Image
                  src={client.logo.url}
                  alt={client.logo.alt || client.name}
                  width={200}
                  height={48}
                  className="h-10 w-auto max-w-[65%] object-contain opacity-40 transition-opacity duration-300 [filter:var(--logo-filter)] group-hover:opacity-100"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

