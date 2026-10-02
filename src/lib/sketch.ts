// Générateurs de tracés SVG "à main levée" : légères irrégularités, déterministes
// (même graine → même tracé côté serveur et client, pas d'erreur d'hydratation).
// Chaque forme est un seul tracé continu, pour pouvoir l'animer avec stroke-dashoffset.

type Point = [number, number];

function random(seed: number) {
  let s = seed % 2147483647 || 1;
  // renvoie un nombre entre -1 et 1
  return () => {
    s = (s * 16807) % 2147483647;
    return (s / 2147483647) * 2 - 1;
  };
}

const f = (n: number) => n.toFixed(1);

/** Rectangle esquissé : côtés légèrement courbes, le trait dépasse un peu à la fermeture. */
export function sketchRect(x: number, y: number, w: number, h: number, seed: number) {
  const r = random(seed);
  const j = (amount = 2) => r() * amount;
  const corners: Point[] = [
    [x + w + j(), y + j()],
    [x + w + j(), y + h + j()],
    [x + j(), y + h + j()],
    [x + j(), y + j()],
  ];

  let prev: Point = [x + 8, y + j()];
  let d = `M${f(prev[0])},${f(prev[1])}`;
  for (const c of corners) {
    const mid: Point = [(prev[0] + c[0]) / 2 + j(3), (prev[1] + c[1]) / 2 + j(3)];
    d += ` Q${f(mid[0])},${f(mid[1])} ${f(c[0])},${f(c[1])}`;
    prev = c;
  }
  // dépassement en repassant sur le début du côté haut
  d += ` Q${f(x + 12)},${f(y + j())} ${f(x + 26)},${f(y + 2 + j())}`;
  return d;
}

/** Ellipse esquissée qui ne se referme pas tout à fait (comme un entourage au stylo). */
export function sketchEllipse(cx: number, cy: number, rx: number, ry: number, seed: number) {
  const r = random(seed);
  const steps = 48;
  const start = -0.4;
  const end = start + Math.PI * 2 + 0.5;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = start + ((end - start) * i) / steps;
    const k = 1 + r() * 0.02;
    const px = cx + Math.cos(t) * rx * k;
    const py = cy + Math.sin(t) * ry * k;
    d += `${i === 0 ? "M" : " L"}${f(px)},${f(py)}`;
  }
  return d;
}

/** Flèche légèrement courbée : renvoie le corps et la pointe (deux tracés à dessiner l'un après l'autre). */
export function sketchArrow(x1: number, y1: number, x2: number, y2: number, bend: number, seed: number) {
  const r = random(seed);
  // point de contrôle décalé perpendiculairement au segment
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const cx = mx + nx * (bend + r() * 3);
  const cy = my + ny * (bend + r() * 3);

  const body = `M${f(x1)},${f(y1)} Q${f(cx)},${f(cy)} ${f(x2)},${f(y2)}`;

  // pointe orientée selon la tangente en fin de courbe
  const angle = Math.atan2(y2 - cy, x2 - cx);
  const size = 10;
  const a1 = angle + Math.PI * 0.82;
  const a2 = angle - Math.PI * 0.82;
  const head =
    `M${f(x2 + Math.cos(a1) * size)},${f(y2 + Math.sin(a1) * size)}` +
    ` L${f(x2)},${f(y2)}` +
    ` L${f(x2 + Math.cos(a2) * size)},${f(y2 + Math.sin(a2) * size)}`;

  return { body, head };
}

/** Soulignement esquissé (une vague très légère). */
export function sketchUnderline(x: number, y: number, w: number, seed: number) {
  const r = random(seed);
  return `M${f(x)},${f(y + r())} Q${f(x + w / 2)},${f(y + 4 + r() * 2)} ${f(x + w)},${f(y - 1 + r())}`;
}
