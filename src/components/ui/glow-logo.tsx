"use client";

import { LOGO_PATHS } from "@/components/ui/logo";
import { GlowOutline, type ShapeRenderer } from "@/components/ui/glow-outline";

// Logo en contour lumineux (section About) : lueur à l'opposé de la souris.
// viewBox recadré au plus près du tracé (boîte englobante des chemins de LOGO_PATHS,
// + un demi-trait pour ne pas rogner le contour de 1px) : le logo touche les bords du conteneur.
const PAD = 0.5;
const VIEWBOX = { x: 34.75 - PAD, y: 16.33 - PAD, w: 210.25 - 34.75 + 2 * PAD, h: 186.67 - 16.33 + 2 * PAD };

const logo: ShapeRenderer = (props) => (
  <g>
    {LOGO_PATHS.map((d) => (
      <path key={d} d={d} {...(props as React.SVGProps<SVGPathElement>)} />
    ))}
  </g>
);

export function GlowLogo({
  className = "",
  svgClassName = "h-auto w-full",
}: {
  className?: string;
  /** Taille du SVG (garde toujours le ratio du logo) */
  svgClassName?: string;
}) {
  return <GlowOutline viewBox={VIEWBOX} shape={logo} className={className} svgClassName={svgClassName} />;
}
