"use client";

import { useEffect, useRef } from "react";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/components/ui/logo";

// Nuage de particules global (canvas fixe, en arrière-plan, derrière le contenu),
// piloté par le scroll comme une timeline. Le parcours passe par des étapes, chacune étant une
// forme complètement formée à une position de scroll précise :
//   hero      → le logo, à droite (en haut sur mobile)                 (haut de page)
//   work      → un anneau autour des flèches du slider                  [data-particles="work-arrows"]
//   services  → le contour de chaque case, Think puis Build… → Scale    [data-particles="services-track"]
//   about     → l'intérieur du logo lumineux                            [data-particles="about-logo"]
//   stack     → deux bandes dans les marges gauche/droite de la section Tools
//   contact   → un anneau autour du bouton « Get in touch »             [data-particles="contact-cta"]
// Entre deux étapes, la position de chaque particule est un mélange des deux formes, proportionnel
// au scroll : si le scroll s'arrête à mi-chemin, les particules s'arrêtent à mi-chemin.
// Toutes les formes listent leurs points dans le même ordre (en tournant autour de leur centre depuis
// le coin haut gauche) : la forme se transforme en entier, sans croisement de trajectoires.
// La position affichée suit le parcours avec un lissage (SMOOTH).
// Par-dessus : lévitation, répulsion de la souris (ressort amorti sur un décalage) et, au chargement,
// rassemblement depuis des positions dispersées. Couleur = couleur du texte du thème.

const SIZE = 1.8; // taille d'une particule (px)
const SAMPLE_WIDTH = 400; // largeur du logo échantillonné (px) …
const SAMPLE_STEP = 6; // … un point tous les SAMPLE_STEP px → nombre de particules
const SMOOTH = 0.08; // part de l'écart parcourue à chaque frame (0.08 = lissage à 92 % : léger retard)
const CURVE = 0.3; // courbure des trajectoires (écart au milieu du trajet, en part de sa longueur)
const SPRING = 0.022; // rappel du décalage (souris, arrivée) vers 0
const DAMPING = 0.9; // amortissement du décalage
const MOUSE_RADIUS = 130; // rayon d'action de la souris (px)
const MOUSE_FORCE = 2.2; // force de répulsion
const FLOAT = 6; // amplitude de la lévitation (px)
const RING_THICKNESS = 7; // épaisseur des anneaux (px)

type Rect = { x: number; y: number; w: number; h: number };
type Particle = {
  x: number; // position affichée
  y: number;
  ox: number; // décalage par rapport au parcours (souris, arrivée au chargement)
  oy: number;
  vx: number;
  vy: number;
  sx: number; // position lissée sur le parcours
  sy: number;
  phase: number; // décalage de la lévitation
  speed: number; // vitesse propre de la lévitation
  alpha: number;
  a: number; // graines aléatoires fixes (0 → 1) : position dans les formes
  b: number;
};
type Step = { scroll: number; fill: (x: Float32Array, y: Float32Array) => void };

// Points du logo, normalisés (0 → 1) dans sa boîte englobante
function sampleLogo(): { x: number; y: number }[] {
  const scale = SAMPLE_WIDTH / LOGO_VIEWBOX.width;
  const w = SAMPLE_WIDTH;
  const h = Math.ceil(LOGO_VIEWBOX.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  ctx.scale(scale, scale);
  for (const d of LOGO_PATHS) ctx.fill(new Path2D(d));
  const data = ctx.getImageData(0, 0, w, h).data;
  const points = [];
  for (let y = 0; y < h; y += SAMPLE_STEP) {
    for (let x = 0; x < w; x += SAMPLE_STEP) {
      if (data[(y * w + x) * 4 + 3] >= 128) points.push({ x: x / w, y: y / h });
    }
  }
  // même ordre que les anneaux (onPerimeter) : angle autour du centre, depuis le coin haut gauche,
  // dans le sens horaire
  const start = Math.atan2(-0.5, -0.5);
  const turn = (p: { x: number; y: number }) =>
    (Math.atan2(p.y - 0.5, p.x - 0.5) - start + Math.PI * 4) % (Math.PI * 2);
  return points.sort((p, q) => turn(p) - turn(q));
}

const toRect = (r: DOMRect): Rect => ({ x: r.left, y: r.top, w: r.width, h: r.height });
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (v: number) => v * v * (3 - 2 * v);

// Position sur le contour d'un rectangle agrandi de `pad`, pour t ∈ [0, 1[, avec un décalage
// perpendiculaire `offset` (épaisseur de l'anneau)
function onPerimeter(rect: Rect, pad: number, t: number, offset: number) {
  const x = rect.x - pad;
  const y = rect.y - pad;
  const w = rect.w + pad * 2;
  const h = rect.h + pad * 2;
  let d = t * 2 * (w + h);
  if (d < w) return { x: x + d, y: y + offset };
  d -= w;
  if (d < h) return { x: x + w + offset, y: y + d };
  d -= h;
  if (d < w) return { x: x + w - d, y: y + h + offset };
  d -= w;
  return { x: x + offset, y: y + h - d };
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const logo = sampleLogo();
    const count = logo.length;
    if (!count) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
      sx: 0,
      sy: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.7 + Math.random() * 0.9,
      alpha: 0.45 + Math.random() * 0.55,
      a: Math.random(),
      b: Math.random(),
    }));
    // formes des deux étapes qui encadrent le scroll actuel
    const fromX = new Float32Array(count);
    const fromY = new Float32Array(count);
    const toX = new Float32Array(count);
    const toY = new Float32Array(count);

    const $ = (selector: string) => document.querySelector<HTMLElement | SVGElement>(selector);
    const rectOf = (el: Element) => toRect(el.getBoundingClientRect());
    // position de scroll où l'élément est centré verticalement dans l'écran
    const centeredAt = (el: Element) => {
      const r = el.getBoundingClientRect();
      return window.scrollY + r.top + r.height / 2 - height / 2;
    };

    // --- Formes (coordonnées écran, au scroll actuel) ------------------------------------------

    const logoShape = (rect: Rect) => (X: Float32Array, Y: Float32Array) => {
      for (let i = 0; i < count; i++) {
        X[i] = rect.x + logo[i].x * rect.w;
        Y[i] = rect.y + logo[i].y * rect.h;
      }
    };

    const ringShape = (rect: Rect, pad: number) => (X: Float32Array, Y: Float32Array) => {
      for (let i = 0; i < count; i++) {
        const p = onPerimeter(rect, pad, i / count, (particles[i].b * 2 - 1) * RING_THICKNESS);
        X[i] = p.x;
        Y[i] = p.y;
      }
    };

    // deux bandes verticales, entre le bord de l'écran et les bordures de la section. Même ordre que
    // les autres formes : la bande droite de haut en bas, puis la bande gauche de bas en haut.
    const gutterShape = (inner: Rect) => (X: Float32Array, Y: Float32Array) => {
      const left = Math.max(inner.x, 6);
      const right = Math.max(width - (inner.x + inner.w), 6);
      for (let i = 0; i < count; i++) {
        const t = (i / count + 0.875) % 1; // 0 → 0.5 : droite ; 0.5 → 1 : gauche
        const { a } = particles[i];
        if (t < 0.5) {
          X[i] = inner.x + inner.w + a * right;
          Y[i] = inner.y + (t / 0.5) * inner.h;
        } else {
          X[i] = inner.x - left + a * left;
          Y[i] = inner.y + (1 - (t - 0.5) / 0.5) * inner.h;
        }
      }
    };

    // Hero : à droite sur grand écran, en haut sur mobile
    const heroLogoRect = (hero: Rect): Rect => {
      const desktop = width >= 1024;
      const place = desktop ? { x: 0.72, y: 0.5, size: 0.62 } : { x: 0.5, y: 0.24, size: 0.7 };
      const scale = Math.min((hero.w * place.size) / LOGO_VIEWBOX.width, (hero.h * place.size) / LOGO_VIEWBOX.height);
      const w = LOGO_VIEWBOX.width * scale;
      const h = LOGO_VIEWBOX.height * scale;
      return { x: hero.x + hero.w * place.x - w / 2, y: hero.y + hero.h * place.y - h / 2, w, h };
    };

    // --- Étapes du parcours ----------------------------------------------------------------------

    const steps = (): Step[] => {
      const list: Step[] = [];
      const hero = document.getElementById("hero");
      if (hero) list.push({ scroll: 0, fill: logoShape(heroLogoRect(rectOf(hero))) });

      const arrows = $('[data-particles="work-arrows"]');
      if (arrows) list.push({ scroll: centeredAt(arrows), fill: ringShape(rectOf(arrows), 14) });

      // une étape par case : au milieu de la tranche de scroll de chaque étape de la section
      const track = $('[data-particles="services-track"]');
      const cards = document.querySelectorAll<HTMLElement>("#services li");
      if (track && cards.length) {
        const r = track.getBoundingClientRect();
        const start = window.scrollY + r.top;
        const range = Math.max(1, r.height - height);
        cards.forEach((card, k) => {
          list.push({
            scroll: start + ((k + 0.5) / cards.length) * range,
            // anneau calé sur les bordures de la case (sans recouvrir son texte)
            fill: ringShape(rectOf(card), -2),
          });
        });
      }

      const aboutLogo = $('[data-particles="about-logo"]');
      if (aboutLogo) list.push({ scroll: centeredAt(aboutLogo), fill: logoShape(rectOf(aboutLogo)) });

      const stack = document.querySelector<HTMLElement>("#stack > div");
      if (stack) list.push({ scroll: centeredAt(stack), fill: gutterShape(rectOf(stack)) });

      const cta = $('[data-particles="contact-cta"]');
      if (cta) list.push({ scroll: centeredAt(cta), fill: ringShape(rectOf(cta), 18) });

      // garantit un ordre croissant (positions de scroll très proches)
      for (let i = 1; i < list.length; i++) {
        list[i].scroll = Math.max(list[i].scroll, list[i - 1].scroll + 1);
      }
      return list;
    };

    // --- Animation -----------------------------------------------------------------------------

    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let first = true;

    const frame = (time: number) => {
      // étapes qui encadrent le scroll actuel, et avancement entre les deux
      const list = steps();
      const scroll = window.scrollY;
      let progress = 0;
      if (!list.length) {
        raf = requestAnimationFrame(frame);
        return;
      }
      let i = list.findIndex((s) => s.scroll > scroll) - 1;
      if (i === -2) i = list.length - 1; // après la dernière étape
      if (i < 0) {
        list[0].fill(fromX, fromY); // avant la première étape
      } else if (i >= list.length - 1) {
        list[list.length - 1].fill(fromX, fromY);
      } else {
        list[i].fill(fromX, fromY);
        list[i + 1].fill(toX, toY);
        progress = (scroll - list[i].scroll) / (list[i + 1].scroll - list[i].scroll);
      }

      const t = time / 1000;
      for (let k = 0; k < count; k++) {
        const p = particles[k];

        // position sur le parcours : mélange des deux formes (adouci au début et à la fin), le long
        // d'un arc : au milieu du trajet, la particule s'écarte perpendiculairement de la ligne droite
        // (toutes du même côté, courbure légèrement différente par particule)
        const local = smoothstep(clamp01(progress));
        let px = fromX[k];
        let py = fromY[k];
        if (progress) {
          const dx = toX[k] - fromX[k];
          const dy = toY[k] - fromY[k];
          const bend = Math.sin(Math.PI * local) * CURVE * (0.7 + p.a * 0.6);
          px += dx * local - dy * bend;
          py += dy * local + dx * bend;
        }

        if (reduced) {
          p.x = px;
          p.y = py;
          continue;
        }

        // au chargement : départ dispersé dans l'écran, le ressort ramène le décalage à 0
        if (first) {
          p.sx = px;
          p.sy = py;
          p.ox = Math.random() * width - px;
          p.oy = Math.random() * height - py;
        }
        // lissage : la position suit le parcours en parcourant SMOOTH de l'écart à chaque frame
        p.sx += (px - p.sx) * SMOOTH;
        p.sy += (py - p.sy) * SMOOTH;

        // lévitation : deux sinusoïdes de fréquences différentes par axe (trajectoire organique)
        const ts = t * p.speed;
        const fx = (Math.sin(ts + p.phase) * 0.7 + Math.sin(ts * 2.3 + p.phase * 2) * 0.3) * FLOAT;
        const fy = (Math.cos(ts * 0.8 + p.phase * 1.3) * 0.7 + Math.sin(ts * 1.7 + p.phase) * 0.3) * FLOAT;

        // répulsion de la souris, appliquée au décalage
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS && dist > 0.01) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.vx = (p.vx - p.ox * SPRING) * DAMPING;
        p.vy = (p.vy - p.oy * SPRING) * DAMPING;
        p.ox += p.vx;
        p.oy += p.vy;

        p.x = p.sx + fx + p.ox;
        p.y = p.sy + fy + p.oy;
      }
      first = false;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(canvas).color;
      for (const p of particles) {
        // inutile de dessiner hors de l'écran
        if (p.x < -10 || p.y < -10 || p.x > width + 10 || p.y > height + 10) continue;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, SIZE, SIZE);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 text-foreground"
    />
  );
}
