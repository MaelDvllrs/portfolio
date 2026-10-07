"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { C, sprite, type Dir, type Frame } from "./mascot-sprite";

// Mascottes pixel art (grille 16×16) qui se promènent dans toute la zone du parent.
// - 8 orientations : face, dos, côtés et 3/4, déduites du décalage du visage ;
// - marche : alterne deux pas (une jambe levée puis l'autre, les bras se balancent) ;
//   à l'arrêt : debout, de face, avec un clignement des yeux de temps en temps ;
// - pseudo-3D : plus une mascotte est haute dans la zone, plus elle est loin → plus petite,
//   plus lente à la verticale (perspective), et dessinée derrière celles du premier plan.
// Une seule boucle d'animation pour toutes les mascottes, active seulement quand la zone est visible.
// Zone : par défaut tout le parent (en `relative`) ; `className` permet une autre zone, ex.
// `fixed inset-0` pour tout l'écran. `scale` réduit la taille, `dim` passe en palette sombre.

// Direction (8) à partir du vecteur vitesse ; y vers le bas = vers le spectateur (face)
function direction(dx: number, dy: number): Dir {
  const dirs: Dir[] = ["E", "SE", "S", "SW", "W", "NW", "N", "NE"];
  const angle = Math.atan2(dy, dx);
  return dirs[(Math.round(angle / (Math.PI / 4)) + 8) % 8];
}

const PIXEL = 4; // taille d'un pixel du sprite à l'échelle 1
const SIZE = 16 * PIXEL;
const SPEED = 55; // px/s
const DEPTH = 0.6; // la verticale est parcourue plus lentement (perspective)
const SCALE_FAR = 0.6; // échelle en haut de la zone
const SCALE_NEAR = 1.15; // échelle en bas de la zone

// Palette sombre (`dim`) : corps de la couleur du fond de la page, contour plus clair (couleur
// secondaire du thème), visage plus sombre ; les blancs et reflets ne changent pas.
const DIM_COLORS: Record<string, string> = {
  [C.body]: "var(--background)",
  [C.edge]: "var(--muted)",
  [C.ink]: "#0a0a0c",
};

type Pose = { dir: Dir; frame: Frame; blink: boolean };
const STANDING: Pose = { dir: "S", frame: 0, blink: false };

export function Mascots({
  count = 3,
  scale = 1,
  dim = false,
  className = "absolute inset-0 z-0",
}: {
  count?: number;
  /** Taille relative (1 = taille d'origine) */
  scale?: number;
  /** Couleurs assombries */
  dim?: boolean;
  /** Position et taille de la zone de promenade */
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [poses, setPoses] = useState<Pose[]>(() => Array.from({ length: count }, () => STANDING));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const area = () => root.getBoundingClientRect();
    const randomPoint = () => {
      const { width, height } = area();
      const size = SIZE * scale;
      const margin = size * 0.6;
      return {
        x: margin + Math.random() * Math.max(0, width - margin * 2),
        y: size * 0.7 + Math.random() * Math.max(0, height - size * 0.9),
      };
    };

    const now0 = performance.now();
    const walkers = Array.from({ length: count }, (_, i) => ({
      pos: randomPoint(),
      target: randomPoint(),
      // départs décalés pour qu'elles ne bougent pas toutes en même temps
      pauseUntil: now0 + 400 + i * 900 + Math.random() * 800,
      nextBlink: now0 + 1500 + Math.random() * 3000,
      lastFrameSwap: 0,
      pose: STANDING,
    }));

    let raf = 0;
    let last = now0;
    let running = false;

    const place = (i: number) => {
      const body = bodiesRef.current[i];
      if (!body) return;
      const { pos } = walkers[i];
      const { height } = area();
      const depth = height ? pos.y / height : 1;
      const perspective = SCALE_FAR + (SCALE_NEAR - SCALE_FAR) * depth;
      // pos = point des pieds ; le sprite est ancré en bas au centre
      body.style.transform = `translate(${pos.x - SIZE / 2}px, ${pos.y - SIZE}px) scale(${perspective * scale})`;
      // la plus proche (la plus basse) passe devant
      body.style.zIndex = String(Math.round(pos.y));
    };

    const commit = (i: number, next: Pose) => {
      const w = walkers[i];
      if (next.dir === w.pose.dir && next.frame === w.pose.frame && next.blink === w.pose.blink) return;
      w.pose = next;
      setPoses((prev) => prev.map((p, j) => (j === i ? next : p)));
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      walkers.forEach((w, i) => {
        const dx = w.target.x - w.pos.x;
        const dy = w.target.y - w.pos.y;
        const dist = Math.hypot(dx, dy);

        if (now < w.pauseUntil) {
          // à l'arrêt : de face, clignement des yeux de temps en temps
          if (now > w.nextBlink) w.nextBlink = now + 2500 + Math.random() * 3000;
          commit(i, { dir: "S", frame: 0, blink: now > w.nextBlink - 150 });
        } else if (dist < 2) {
          w.pauseUntil = now + 1200 + Math.random() * 2500;
          w.target = randomPoint();
        } else {
          const step = SPEED * dt;
          if (step >= dist) w.pos = { ...w.target };
          else w.pos = { x: w.pos.x + (dx / dist) * step, y: w.pos.y + (dy / dist) * step * DEPTH };
          // alterne les jambes toutes les 160 ms
          const frame = w.pose.frame;
          const nextFrame: Frame = frame === 0 ? 1 : now - w.lastFrameSwap > 160 ? (frame === 1 ? 2 : 1) : frame;
          if (nextFrame !== frame) w.lastFrameSwap = now;
          commit(i, { dir: direction(dx, dy), frame: nextFrame, blink: false });
        }
        place(i);
      });

      raf = requestAnimationFrame(tick);
    };

    walkers.forEach((_, i) => place(i));
    if (reduced) return;

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    // n'anime que lorsque la zone est visible
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(root);

    return () => {
      io.disconnect();
      stop();
    };
  }, [count, scale]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`pointer-events-none overflow-hidden ${className}`}
    >
      {poses.map((pose, i) => (
        <div
          key={i}
          ref={(el) => {
            bodiesRef.current[i] = el;
          }}
          className="absolute top-0 left-0 origin-bottom will-change-transform"
          style={{ width: SIZE, height: SIZE }}
        >
          {/* ombre au sol */}
          <span className="absolute -bottom-1 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full bg-black/15" />
          <Sprite {...pose} dim={dim} />
        </div>
      ))}
    </div>
  );
}

// Mémoïsé : ne se redessine que si la pose de cette mascotte change
const Sprite = memo(function Sprite({ dir, frame, blink, dim }: Pose & { dim: boolean }) {
  const pixels = useMemo(() => sprite(dir, frame, blink), [dir, frame, blink]);
  return (
    <svg viewBox="0 0 16 16" width={SIZE} height={SIZE} shapeRendering="crispEdges" className="relative">
      {pixels.map(([x, y, c], i) => (
        // couleur en style (et non en attribut) : les variables CSS du thème y sont lues
        <rect key={i} x={x} y={y} width={1} height={1} style={{ fill: (dim && DIM_COLORS[c]) || c }} />
      ))}
    </svg>
  );
});
