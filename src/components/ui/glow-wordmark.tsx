"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GlowOutline, type ShapeRenderer, type ViewBox } from "@/components/ui/glow-outline";

// Mot en très grand (ex. « trymael » sous le footer), en contour lumineux : rempli de la couleur
// du fond, contour couleur des lignes, lueur sous la souris. Le texte est mesuré une fois la police
// chargée pour cadrer le viewBox au plus près des lettres (le mot remplit toute la largeur).
// `cropBottom` : part de la hauteur des lettres masquée par le bas (le viewBox est raccourci ;
// le reste déborde du SVG et doit être coupé par un parent en overflow-hidden).
// `cropTop` : part retirée en haut du cadre (la boîte mesurée inclut l'espace de la police
// au-dessus des lettres les plus hautes) ; le texte y déborde du SVG, rien n'est coupé.
const FONT_SIZE = 200;
// cadrage provisoire avant la mesure (≈ proportions de la police)
const INITIAL: ViewBox = { x: 0, y: -150, w: 700, h: 195 };

export function GlowWordmark({
  text,
  cropBottom = 0,
  cropTop = 0,
  trigger,
  className = "",
}: {
  text: string;
  /** Ancêtre qui déclenche l'effet au survol (voir GlowOutline) */
  trigger?: string;
  /** Part masquée par le bas, de 0 à 1 (ex. 0.3 = 30 %) */
  cropBottom?: number;
  /** Part de vide retirée en haut, de 0 à 1 */
  cropTop?: number;
  className?: string;
}) {
  const measureRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState<ViewBox>(INITIAL);

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      const box = measureRef.current?.getBBox();
      if (!box || cancelled) return;
      const pad = 2; // marge pour ne pas rogner le contour
      setViewBox({ x: box.x - pad, y: box.y - pad, w: box.width + 2 * pad, h: box.height + 2 * pad });
    });
    return () => {
      cancelled = true;
    };
  }, [text]);

  const shape: ShapeRenderer = useCallback(
    (props) => (
      <text
        {...(props as React.SVGProps<SVGTextElement>)}
        x={0}
        y={0}
        fontSize={FONT_SIZE}
        fontWeight={600}
        letterSpacing="-0.04em"
        className="font-sans"
      >
        {text}
      </text>
    ),
    [text],
  );

  return (
    <>
      {/* texte invisible servant uniquement à la mesure */}
      <svg aria-hidden className="pointer-events-none absolute size-0 overflow-hidden select-none">
        <text ref={measureRef} x={0} y={0} fontSize={FONT_SIZE} fontWeight={600} letterSpacing="-0.04em" className="font-sans">
          {text}
        </text>
      </svg>
      <GlowOutline
        viewBox={{
          ...viewBox,
          y: viewBox.y + viewBox.h * cropTop,
          h: viewBox.h * (1 - cropTop - cropBottom),
        }}
        shape={shape}
        fill="var(--background)"
        towardMouse
        trigger={trigger}
        className={className}
      />
    </>
  );
}
