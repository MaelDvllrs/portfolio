"use client";

import { useEffect, useState } from "react";

export type Heading = { id: string; text: string };

// Menu des titres (h3) du texte riche, collant au scroll. Le titre de la partie en cours de
// lecture est mis en avant : le dernier titre passé au-dessus du premier tiers de l'écran.
// Les liens sont des ancres : Lenis (smooth-scroll.tsx) anime le défilement et respecte le
// scroll-margin-top des titres (globals.css), qui laisse la place du header fixe.
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el) => el !== null);
    const update = () => {
      const line = window.innerHeight / 3;
      let current = elements[0]?.id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [headings]);

  return (
    <nav aria-label="On this page" className="sticky top-20">
      <ul className="flex flex-col gap-2 border-l border-border text-sm">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              className={`-ml-px block border-l py-0.5 pl-3 transition-colors ${
                active === h.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
