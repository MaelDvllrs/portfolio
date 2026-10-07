"use client";

import { useEffect, useId, useRef } from "react";

// Forme en contour qui s'éclaire au survol, façon logo Next.js de vercel.com/frameworks/nextjs :
// - base : contour 1px couleur des bordures, remplissage optionnel (ex. couleur du fond) ;
// - au survol : le contour s'allume, avec une lueur plus forte à l'opposé de la souris
//   (ou sous la souris avec `towardMouse`) ;
// - extrusion lumineuse : des copies du contour, décalées progressivement du centre vers la
//   lueur (et légèrement agrandies pour la perspective), de plus en plus transparentes et floues.
// La position de la lueur suit la souris avec un léger retard (interpolation) pour un mouvement doux.
// Les tailles (lueur, extrusion, flou) sont proportionnelles à la hauteur de la forme : même rendu
// pour un logo carré ou un mot très large.
// Zone de survol : la forme elle-même, ou un ancêtre plus large (`trigger`, sélecteur CSS, ex.
// "footer") ; la lueur reste alors bornée à la forme.

export type ViewBox = { x: number; y: number; w: number; h: number };
/** Dessine la forme avec les attributs reçus (trait, remplissage, filtre…) */
export type ShapeRenderer = (props: React.SVGProps<SVGElement>) => React.ReactNode;

const REF_HEIGHT = 171; // hauteur de référence (logo d'origine) pour les tailles ci-dessous
const RADIUS = 70; // rayon de la lueur principale
const DEPTH = 120; // longueur de l'extrusion
const EASE = 0.12; // vitesse de rattrapage (0 → 1)
const LAYERS = 36; // nombre de copies de l'extrusion
const PERSPECTIVE = 0.25; // agrandissement de la dernière copie (+25 %)

export function GlowOutline({
  viewBox,
  shape,
  fill = "none",
  towardMouse = false,
  trigger,
  className = "",
  svgClassName = "h-auto w-full",
}: {
  viewBox: ViewBox;
  /** Ancêtre qui déclenche l'effet au survol (sélecteur pour closest), défaut : la forme */
  trigger?: string;
  shape: ShapeRenderer;
  /** Remplissage de la forme de base (ex. "var(--background)") */
  fill?: string;
  /** Lueur sous la souris (au lieu de l'opposé) */
  towardMouse?: boolean;
  className?: string;
  /** Taille du SVG (garde toujours le ratio de la forme) */
  svgClassName?: string;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mainRef = useRef<SVGRadialGradientElement>(null);
  const beamRef = useRef<SVGRadialGradientElement>(null);
  const layersRef = useRef<SVGGElement>(null);

  const { x: VX, y: VY, w: W, h: H } = viewBox;
  const k = H / REF_HEIGHT; // facteur d'échelle des tailles

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;
    const area = (trigger && root.closest<HTMLElement>(trigger)) || root;

    const CX = VX + W / 2;
    const CY = VY + H / 2;
    const depth = DEPTH * k;
    // position visée et position actuelle de la lueur (unités du viewBox)
    const target = { x: CX, y: CY + 1 };
    const current = { ...target };
    let dir = { x: 0, y: 1 };
    let raf = 0;

    const apply = () => {
      for (const g of [mainRef.current, beamRef.current]) {
        g?.setAttribute("cx", String(current.x));
        g?.setAttribute("cy", String(current.y));
      }
      // direction de l'extrusion : du centre vers la lueur
      const dx = current.x - CX;
      const dy = current.y - CY;
      const len = Math.hypot(dx, dy);
      if (len > 1) dir = { x: dx / len, y: dy / len };

      const layers = layersRef.current?.children ?? [];
      for (let i = 0; i < layers.length; i++) {
        const t = (i + 1) / LAYERS;
        const s = 1 + PERSPECTIVE * t;
        layers[i].setAttribute(
          "transform",
          `translate(${CX + dir.x * depth * t} ${CY + dir.y * depth * t}) scale(${s}) translate(${-CX} ${-CY})`,
        );
      }
    };

    const tick = () => {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      apply();
      raf = Math.hypot(target.x - current.x, target.y - current.y) > 0.1 * k ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      // position de la souris en unités du viewBox (reflet par rapport au centre par défaut)
      const x = VX + ((e.clientX - rect.left) / rect.width) * W;
      const y = VY + ((e.clientY - rect.top) / rect.height) * H;
      const tx = towardMouse ? x : 2 * CX - x;
      const ty = towardMouse ? y : 2 * CY - y;
      // bornée à la forme : souris loin (ailleurs dans la zone de survol) → la lueur longe la forme
      target.x = Math.min(VX + W, Math.max(VX, tx));
      target.y = Math.min(VY + H, Math.max(VY, ty));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // état « survolé » porté par la forme (data-active) : la zone peut être plus large qu'elle
    const onEnter = () => root.setAttribute("data-active", "");
    const onLeave = () => root.removeAttribute("data-active");

    apply();
    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerenter", onEnter);
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerenter", onEnter);
      area.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [VX, VY, W, H, k, towardMouse, trigger]);

  const thin = { fill: "none", strokeWidth: 1, vectorEffect: "non-scaling-stroke" } as const;
  const main = `${id}-main`;
  const beam = `${id}-beam`;
  const blur = `${id}-blur`;
  const beamBlur = `${id}-beam-blur`;

  return (
    <div ref={rootRef} className={`group ${className}`}>
      <svg ref={svgRef} viewBox={`${VX} ${VY} ${W} ${H}`} className={`overflow-visible ${svgClassName}`} aria-hidden>
        <defs>
          {/* lueur principale sur le contour */}
          <radialGradient ref={mainRef} id={main} gradientUnits="userSpaceOnUse" r={RADIUS * k}>
            <stop offset="0" stopColor="var(--foreground)" stopOpacity="1" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
          </radialGradient>
          {/* lumière de l'extrusion : tout le contour projette, plus fort du côté de la lueur */}
          <radialGradient ref={beamRef} id={beam} gradientUnits="userSpaceOnUse" r={RADIUS * 2.6 * k}>
            <stop offset="0" stopColor="var(--foreground)" stopOpacity="1" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0.15" />
          </radialGradient>
          <filter id={blur} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={2.5 * k} />
          </filter>
          <filter id={beamBlur} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={2 * k} />
          </filter>
        </defs>

        {/* effet lumineux (invisible au repos, apparaît au survol), 1/2 : extrusion, dessinée
            derrière la forme de base pour ne pas passer sur son remplissage */}
        <g
          ref={layersRef}
          filter={`url(#${beamBlur})`}
          className="opacity-0 transition-opacity duration-500 group-data-active:opacity-100"
        >
          {Array.from({ length: LAYERS }, (_, i) => {
            const t = (i + 1) / LAYERS;
            return (
              <g key={i} opacity={0.16 * (1 - t) ** 1.6}>
                {shape({ fill: "none", stroke: `url(#${beam})`, strokeWidth: 1.5 * k })}
              </g>
            );
          })}
        </g>

        {/* forme de base : remplissage + contour couleur des bordures */}
        {shape({ ...thin, fill, style: { stroke: "var(--border)" } })}

        {/* effet lumineux, 2/2 : contour allumé + lueur principale avec halo */}
        <g className="opacity-0 transition-opacity duration-500 group-data-active:opacity-100">
          {shape({ ...thin, stroke: "var(--foreground)", strokeOpacity: 0.45 })}
          {shape({ fill: "none", stroke: `url(#${main})`, strokeWidth: 4 * k, filter: `url(#${blur})` })}
          {shape({ ...thin, stroke: `url(#${main})` })}
        </g>
      </svg>
    </div>
  );
}
