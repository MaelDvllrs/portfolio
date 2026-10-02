"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { site } from "@/content/site";
import { Frame } from "@/components/frame";
import { h2Class } from "@/components/section";
import { ThinkDiagram } from "./think-diagram";
import { DashboardScene } from "./dashboard-scene";
import { ScaleScreen } from "./scale-screen";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// État final de chaque type d'animation `data-anim` (l'état initial est posé en inline)
const ANIMATIONS = {
  stroke: { strokeDashoffset: 0 }, // trait qui se dessine
  text: { clipPath: "inset(0 0% 0 0)" }, // texte qui s'écrit de gauche à droite
  block: { opacity: 1, y: 0 }, // bloc qui apparaît en montant
  "grow-x": { scaleX: 1 }, // s'étire depuis la gauche
  "grow-y": { scaleY: 1 }, // pousse depuis le bas
  enter: { opacity: 1, x: 0 }, // entre par le côté
  fade: { opacity: 1 }, // fondu
  pop: { opacity: 1, scale: 1 }, // apparaît en grossissant légèrement
  "shrink-left": { scale: 0.32, xPercent: -28 }, // rapetisse au milieu à gauche
  "into-cloud": { scale: 0.4, xPercent: 48 }, // glisse dans le nuage
};

// Une timeline par étape. Un élément [data-anim] appartient à l'étape de son écran
// (ou à `data-at`). Les éléments de même `data-order` jouent ensemble ; sans `data-order`,
// ils s'enchaînent dans l'ordre du DOM.
function buildTimelines(count: number) {
  const groups = Array.from({ length: count }, () => new Map<number, HTMLElement[]>());

  gsap.utils.toArray<HTMLElement>("[data-anim]").forEach((el, index) => {
    const step = Number(el.dataset.at ?? el.closest<HTMLElement>("[data-step]")?.dataset.step);
    const order = el.dataset.order !== undefined ? Number(el.dataset.order) : 1e6 + index;
    const stepGroups = groups[step];
    if (!stepGroups) return;
    stepGroups.set(order, [...(stepGroups.get(order) ?? []), el]);
  });

  return groups.map((stepGroups) => {
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    [...stepGroups.keys()]
      .sort((a, b) => a - b)
      .forEach((order) => {
        const at = tl.duration();
        stepGroups.get(order)!.forEach((el) => {
          const duration = Number(el.dataset.duration ?? 1);
          tl.to(el, { ...ANIMATIONS[el.dataset.anim as keyof typeof ANIMATIONS], duration }, at);
        });
      });
    return tl;
  });
}

// Section sticky : un écran de scroll par étape (+ un écran pour la vue collée elle-même). Le contenu (titre, écran,
// étapes) reste collé pendant toute la traversée ; chaque tranche de scroll active une étape.
export function WhatIBuild() {
  const { whatIBuild } = site;
  const count = whatIBuild.items.length;
  const sectionRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const timelines = buildTimelines(count);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) timelines.forEach((tl) => tl.progress(1));

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: ({ progress }) => {
          const position = progress * count;
          setActive(Math.min(count - 1, Math.floor(position)));
          // Barre de progression de chaque service : pleine si passé, partielle si en cours
          barsRef.current.forEach((bar, i) => {
            gsap.set(bar, { scaleX: gsap.utils.clamp(0, 1, position - i) });
          });
          // Chaque écran se construit pendant son étape et est terminé à 85 % de celle-ci
          if (!reducedMotion) {
            timelines.forEach((tl, i) => tl.progress(gsap.utils.clamp(0, 1, (position - i) / 0.85)));
          }
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <Frame id="services">
      <div ref={sectionRef} style={{ height: `${(count + 1) * 100}svh` }}>
        <div className="sticky top-0 flex h-svh flex-col gap-8 pt-16 sm:gap-10 sm:pt-20">
          <h2 className={`${h2Class} text-center`}>{whatIBuild.title}</h2>

          {/* Écran : prend la hauteur restante en gardant un ratio 16/10 */}
          <div className="flex min-h-0 flex-1 items-center justify-center [container-type:size]">
            <Screen activeIndex={active} items={whatIBuild.items} />
          </div>

          {/* Étapes : cases carrées bordées, collées entre elles et aux bordures de la section
              (-mx-6 annule le padding du cadre). La barre de progression occupe la bordure du haut. */}
          <ul className="-mx-6 grid grid-cols-2 border-t border-border sm:grid-cols-5">
            {whatIBuild.items.map((item, i) => (
              <li
                key={item.title}
                className="relative flex flex-col justify-between border-b border-border p-5 not-last:border-r max-sm:odd:border-r sm:aspect-square sm:border-b-0"
              >
                <span className="absolute inset-x-0 -top-px h-px overflow-hidden">
                  <span
                    ref={(el) => {
                      barsRef.current[i] = el;
                    }}
                    className="block h-full origin-left scale-x-0 bg-foreground"
                  />
                </span>
                {/* l'opacité porte sur le contenu, pas sur les bordures */}
                <p
                  className={`text-xs text-muted tabular-nums transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-40"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div
                  className={`mt-6 transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-40"}`}
                >
                  <h3 className="font-medium uppercase tracking-wide">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

// Contenu de l'écran, avec les étapes pendant lesquelles il est affiché.
// Le dashboard reste à l'écran de BUILD à SHIP (il s'y colore, puis part dans le cloud).
const SCREENS: { steps: number[]; node: React.ReactNode }[] = [
  { steps: [0], node: <ThinkDiagram /> },
  { steps: [1, 2, 3], node: <DashboardScene /> },
  { steps: [4], node: <ScaleScreen /> },
];

// Complète SCREENS avec un placeholder pour chaque étape sans écran
function screensFor(items: { title: string }[]) {
  const covered = new Set(SCREENS.flatMap((s) => s.steps));
  const placeholders = items.flatMap((item, i) =>
    covered.has(i)
      ? []
      : [
          {
            steps: [i],
            // TODO : illustration des étapes suivantes
            node: (
              <span className="text-2xl font-normal tracking-tight text-neutral-400">{item.title}</span>
            ),
          },
        ],
  );
  return [...SCREENS, ...placeholders];
}

// Fenêtre de navigateur minimaliste, noir et blanc
function Screen({
  activeIndex,
  items,
}: {
  activeIndex: number;
  items: { title: string; description: string }[];
}) {
  return (
    // Largeur = la plus petite entre la place dispo, la hauteur dispo × 16/10 et 48rem
    <div className="flex aspect-[16/10] w-[min(100cqw,100cqh*1.6,48rem)] flex-col overflow-hidden rounded-xl border border-border bg-white">
      {/* Barre du haut : 3 points façon macOS en noir et blanc + barre d'adresse */}
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-border px-4">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-neutral-900" />
          <span className="size-2.5 rounded-full bg-neutral-400" />
          <span className="size-2.5 rounded-full border border-neutral-300 bg-white" />
        </div>
        <span className="mx-auto h-4 w-1/3 rounded-full bg-neutral-100" />
        <span className="w-10" />
      </div>

      {/* Contenu : un écran par groupe d'étapes, en fondu */}
      <div className="relative flex-1">
        {screensFor(items).map(({ steps, node }) => {
          const visible = steps.includes(activeIndex);
          return (
            <div
              key={steps[0]}
              data-step={steps[0]}
              aria-hidden={!visible}
              className={`absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-500 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            >
              {node}
            </div>
          );
        })}
      </div>
    </div>
  );
}
