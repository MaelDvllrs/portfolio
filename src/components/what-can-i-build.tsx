"use client";

import { useEffect, useRef, useState } from "react";
import type { Service } from "@/lib/cms";
import { ServiceIllustration } from "@/components/service-illustrations";

// Durée d'affichage de chaque élément avant de passer au suivant
const DURATION_MS = 6000;

// Section « What can I build » d'une page service (champ `builds` du CMS), en onglets
// automatiques : à gauche la liste des textes séparés par des lignes ; l'élément actif est en
// pleine opacité, une barre grandit en bas de sa case et, une fois pleine, on passe au suivant
// (en boucle). À droite, le visuel de l'élément actif, qui change en fondu. Un clic sur un
// texte l'active. La progression est en pause au survol et quand la section n'est pas visible.
// Mobile : le visuel au-dessus de la liste.
export function WhatCanIBuild({ items }: { items: Service["builds"] }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paused = hovered || !visible;

  return (
    <div ref={root} className="grid md:grid-cols-2">
      {/* visuel de l'élément actif : tous empilés, fondu entre eux (à droite sur ordinateur) */}
      <div className="p-5 md:order-last md:flex md:flex-col md:border-l md:border-border">
        {/* sans fond ni bordure : le visuel se fond dans la page. Sur ordinateur, il prend toute
            la hauteur de la colonne (celle de la liste) pour que les illustrations y soient centrées */}
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-72 md:flex-1">
          {items.map((item, i) => (
            <div
              key={item.title}
              aria-hidden={i !== active}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <ServiceIllustration name={item.visual} />
            </div>
          ))}
        </div>
      </div>

      <ol
        className="divide-y divide-border border-t border-border md:border-t-0"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {items.map((item, i) => (
          <li key={item.title} className="relative">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`flex w-full cursor-pointer flex-col gap-1.5 px-4 py-5 text-left transition-opacity duration-500 sm:px-5 ${
                i === active ? "opacity-100" : "opacity-40 hover:opacity-70"
              }`}
            >
              <h3 className="text-base leading-snug font-medium tracking-tight">{item.title}</h3>
              <p className="text-sm text-muted">{item.text}</p>
            </button>

            {/* barre de progression de l'élément actif : `key` la relance à chaque changement,
                et sa fin passe à l'élément suivant */}
            {i === active && (
              <span
                key={active}
                onAnimationEnd={() => setActive((active + 1) % items.length)}
                style={{ animationDuration: `${DURATION_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                className="absolute inset-x-0 bottom-0 h-px origin-left animate-progress bg-foreground"
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
