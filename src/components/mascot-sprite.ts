// Sprite pixel art de la mascotte (grille 16×16), généré par code pour chaque orientation,
// frame de marche et clignement. Palette issue du mockup.

export type Dir = "S" | "SE" | "E" | "NE" | "N" | "NW" | "W" | "SW";

const C = {
  ink: "#1A1C22",
  body: "#3A3F56",
  edge: "#6B6F7E",
  light: "#C8C9CC",
  white: "#FFFFFF",
};

// Corps : pour chaque ligne, première et dernière colonne (triangle aux bords arrondis)
const BODY: [number, number][] = [
  [7, 8], [6, 9], [5, 10], [5, 10], [4, 11], [4, 11],
  [3, 12], [3, 12], [2, 13], [2, 13], [1, 14], [2, 13],
];
// Visage (fenêtre noire) : lignes 6 à 10
const FACE: Record<number, [number, number]> = { 6: [6, 9], 7: [5, 10], 8: [5, 10], 9: [5, 10], 10: [5, 10] };

// Décalage horizontal du visage selon l'orientation ; null = vue de dos (pas de visage)
const FACE_OFFSET: Record<Dir, number | null> = {
  S: 0, SE: 1, E: 3, NE: null, N: null, NW: null, W: -3, SW: -1,
};
const SIDE = new Set<Dir>(["E", "W"]);

export type Pixel = [x: number, y: number, color: string];

/** frame : 0 = debout, 1 et 2 = pas (jambe gauche puis droite levée). */
export type Frame = 0 | 1 | 2;

export function sprite(dir: Dir, frame: Frame, blink: boolean): Pixel[] {
  const px: Pixel[] = [];
  const set = (x: number, y: number, c: string) => px.push([x, y, c]);

  // Jambes + chaussures (dessinées d'abord, le corps passe devant)
  const side = SIDE.has(dir);
  const legs = side ? [6, 8] : [4, 10];
  legs.forEach((lx, i) => {
    // de face/dos : une jambe levée par pas ; de profil : les jambes avancent/reculent
    const stepping = frame === (i === 0 ? 1 : 2);
    const lift = !side && stepping ? 1 : 0;
    const stride = side && frame !== 0 ? (stepping ? -1 : 1) : 0;
    const x = lx + stride;
    for (const y of [12, 13 - lift]) {
      set(x, y, C.edge);
      set(x + 1, y, C.body);
    }
    for (let sx = x - 1; sx <= x + 2; sx++) {
      set(sx, 14 - lift, sx === x ? C.white : C.edge);
      set(sx, 15 - lift, C.body);
    }
  });

  // Corps
  BODY.forEach(([a, b], y) => {
    for (let x = a; x <= b; x++) {
      if (y === 0) set(x, y, C.white);
      else if (y === 1 && x > a && x < b) set(x, y, C.light);
      else set(x, y, x === a || x === b || y === BODY.length - 1 ? C.edge : C.body);
    }
  });

  // Bras : deux pastilles accrochées aux flancs (face/dos), une seule en bas du corps (profil).
  // En marchant, le bras opposé à la jambe levée remonte (balancement).
  if (side) {
    const swing = frame === 1 ? -1 : frame === 2 ? 1 : 0;
    const ax = (dir === "E" ? 6 : 8) + swing;
    set(ax, 9, C.white);
    set(ax + 1, 9, C.light);
    set(ax, 10, C.light);
    set(ax + 1, 10, C.light);
  } else {
    const arms = [
      [0, frame === 2 ? 7 : 8],
      [14, frame === 1 ? 7 : 8],
    ] as const;
    for (const [x0, y0] of arms) {
      set(x0 + 1, y0, C.white);
      set(x0, y0 + 1, C.light);
      set(x0 + 1, y0 + 1, C.white);
      set(x0, y0 + 2, C.light);
      set(x0 + 1, y0 + 2, C.light);
    }
  }

  // Visage : rogné par la silhouette (de profil on n'en voit qu'un bord, un seul œil)
  const o = FACE_OFFSET[dir];
  if (o !== null) {
    for (const [row, [a, b]] of Object.entries(FACE)) {
      const y = Number(row);
      const [ba, bb] = BODY[y];
      for (let x = a + o; x <= b + o; x++) {
        if (x > ba && x < bb) set(x, y, C.ink);
      }
    }
    if (!blink) {
      for (const ex of [6 + o, 9 + o]) {
        for (const ey of [7, 8]) {
          const [ba, bb] = BODY[ey];
          if (ex > ba && ex < bb) set(ex, ey, C.white);
        }
      }
    } else {
      // yeux fermés : un trait
      for (const ex of [6 + o, 9 + o]) {
        const [ba, bb] = BODY[8];
        if (ex > ba && ex < bb) set(ex, 8, C.light);
      }
    }
  }
  return px;
}
