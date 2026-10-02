"use client";

import { useEffect, useId, useRef } from "react";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/components/ui/logo";

// Logo en contour qui s'éclaire au survol, façon logo Next.js de vercel.com/frameworks/nextjs :
// - base : contour 1px couleur des bordures (text-border) ;
// - au survol : le contour s'allume, avec une lueur plus forte à l'opposé de la souris ;
// - extrusion lumineuse : des copies du contour, décalées progressivement à l'opposé de la souris
//   (et légèrement agrandies pour la perspective), de plus en plus transparentes et floutées.
//   La lumière semble ainsi partir des bordures et se projeter vers l'extérieur, en volume.
// La position de la lueur suit la souris avec un léger retard (interpolation) pour un mouvement doux.

const { width: W, height: H } = LOGO_VIEWBOX;
const CX = W / 2;
const CY = H / 2;
const RADIUS = 70; // rayon de la lueur principale, en unités du viewBox
const EASE = 0.12; // vitesse de rattrapage (0 → 1)
const LAYERS = 36; // nombre de copies de l'extrusion
const DEPTH = 120; // longueur de l'extrusion, en unités du viewBox
const PERSPECTIVE = 0.25; // agrandissement de la dernière copie (+25 %)

export function GlowLogo({ className = "" }: { className?: string }) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mainRef = useRef<SVGRadialGradientElement>(null);
  const beamRef = useRef<SVGRadialGradientElement>(null);
  const layersRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;

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
      // direction de l'extrusion : du centre vers la lueur (donc à l'opposé de la souris)
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
          `translate(${CX + dir.x * DEPTH * t} ${CY + dir.y * DEPTH * t}) scale(${s}) translate(${-CX} ${-CY})`,
        );
      }
    };

    const tick = () => {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      apply();
      raf = Math.hypot(target.x - current.x, target.y - current.y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      // position de la souris en unités du viewBox, puis reflet par rapport au centre
      const x = ((e.clientX - rect.left) / rect.width) * W;
      const y = ((e.clientY - rect.top) / rect.height) * H;
      target.x = W - x;
      target.y = H - y;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    apply();
    root.addEventListener("pointermove", onMove);
    return () => {
      root.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const thin = { fill: "none", strokeWidth: 1, vectorEffect: "non-scaling-stroke" } as const;
  const main = `${id}-main`;
  const beam = `${id}-beam`;
  const blur = `${id}-blur`;
  const beamBlur = `${id}-beam-blur`;

  return (
    <div ref={rootRef} className={`group ${className}`}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" aria-hidden>
        <defs>
          {/* lueur principale sur le contour */}
          <radialGradient ref={mainRef} id={main} gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={RADIUS}>
            <stop offset="0" stopColor="var(--foreground)" stopOpacity="1" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
          </radialGradient>
          {/* lumière de l'extrusion : tout le contour projette, plus fort du côté de la lueur */}
          <radialGradient ref={beamRef} id={beam} gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={RADIUS * 2.6}>
            <stop offset="0" stopColor="var(--foreground)" stopOpacity="1" />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0.15" />
          </radialGradient>
          <filter id={blur} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id={beamBlur} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* contour de base */}
        {LOGO_PATHS.map((d) => (
          <path key={d} d={d} {...thin} className="stroke-border" />
        ))}

        {/* effet lumineux : invisible au repos, apparaît au survol */}
        <g className="opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {/* extrusion : copies du contour de plus en plus loin et transparentes */}
          <g ref={layersRef} filter={`url(#${beamBlur})`}>
            {Array.from({ length: LAYERS }, (_, i) => {
              const t = (i + 1) / LAYERS;
              return (
                <g key={i} opacity={0.16 * (1 - t) ** 1.6}>
                  {LOGO_PATHS.map((d) => (
                    <path key={d} d={d} fill="none" stroke={`url(#${beam})`} strokeWidth={1.5} />
                  ))}
                </g>
              );
            })}
          </g>

          {/* contour allumé + lueur principale avec halo */}
          {LOGO_PATHS.map((d) => (
            <g key={d}>
              <path d={d} {...thin} stroke="var(--foreground)" strokeOpacity={0.45} />
              <path d={d} fill="none" stroke={`url(#${main})`} strokeWidth={4} filter={`url(#${blur})`} />
              <path d={d} {...thin} stroke={`url(#${main})`} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
