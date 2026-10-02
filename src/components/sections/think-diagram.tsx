import { handwriting } from "@/lib/fonts";
import { sketchArrow, sketchEllipse, sketchRect, sketchUnderline } from "@/lib/sketch";

// Schéma d'architecture "dessiné à la main" de l'étape THINK.
// Pas d'animation ici : chaque élément marqué `data-anim` est dessiné par le parent,
// dans l'ordre du DOM. `data-duration` = poids relatif de l'élément dans la séquence.
// L'état initial (invisible) est posé en inline pour éviter un flash avant l'hydratation.

const hidden = { strokeDasharray: 1, strokeDashoffset: 1 };
const hiddenText = { clipPath: "inset(0 100% 0 0)" };

function Stroke({ d, duration = 1 }: { d: string; duration?: number }) {
  return <path d={d} pathLength={1} style={hidden} data-anim="stroke" data-duration={duration} />;
}

function Label({
  x,
  y,
  children,
  anchor = "middle",
  size = 26,
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle";
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fill="currentColor"
      stroke="none"
      style={{ ...hiddenText, fontFamily: handwriting.style.fontFamily }}
      data-anim="text"
      data-duration={0.5}
    >
      {children}
    </text>
  );
}

function Arrow(props: { from: [number, number]; to: [number, number]; bend?: number; seed: number }) {
  const { body, head } = sketchArrow(...props.from, ...props.to, props.bend ?? 0, props.seed);
  return (
    <>
      <Stroke d={body} duration={0.6} />
      <Stroke d={head} duration={0.2} />
    </>
  );
}

export function ThinkDiagram() {
  return (
    <svg
      viewBox="0 0 800 450"
      className="h-full w-full text-neutral-800"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Architecture sketch: users, frontend, API, database and LLM"
      role="img"
    >
      <Label x={40} y={62} anchor="start" size={30}>
        v1 — architecture
      </Label>
      <Stroke d={sketchUnderline(40, 74, 200, 11)} duration={0.4} />

      <Stroke d={sketchRect(40, 195, 120, 60, 1)} />
      <Label x={100} y={233}>Users</Label>
      <Arrow from={[168, 225]} to={[214, 225]} bend={4} seed={2} />

      <Stroke d={sketchRect(222, 195, 150, 60, 3)} />
      <Label x={297} y={233}>Frontend</Label>
      <Arrow from={[380, 225]} to={[424, 225]} bend={-4} seed={4} />

      <Stroke d={sketchRect(432, 195, 120, 60, 5)} />
      <Label x={492} y={233}>API</Label>

      <Arrow from={[560, 205]} to={[612, 140]} bend={-8} seed={6} />
      <Stroke d={sketchRect(618, 100, 150, 60, 7)} />
      <Label x={693} y={138}>Database</Label>

      <Arrow from={[560, 245]} to={[612, 312]} bend={8} seed={8} />
      <Stroke d={sketchRect(618, 285, 150, 60, 9)} />
      <Label x={693} y={323}>LLM + RAG</Label>

      {/* Annotations */}
      <Label x={297} y={150} size={22}>
        auth?
      </Label>
      <Arrow from={[297, 158]} to={[297, 186]} bend={3} seed={10} />

      <Stroke d={sketchEllipse(492, 225, 86, 54, 12)} duration={1.2} />
      <Label x={492} y={318} size={22}>
        keep it simple
      </Label>
    </svg>
  );
}
