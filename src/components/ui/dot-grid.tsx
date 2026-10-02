"use client";

import { useEffect, useRef } from "react";

// Fond en grille de petits carrés arrondis (style matrice de LED), en canvas.
// - Chaque case a une teinte de gris aléatoire, plus marquée au centre (vignette).
// - Au survol, les cases sous la souris foncent puis reviennent : une traînée suit le curseur.
// Le canvas remplit son parent (qui doit être en `relative`) et écoute la souris sur ce parent,
// pour que le contenu posé au-dessus ne bloque pas l'effet.

const CELL = 12; // taille d'une case (px)
const GAP = 4; // espace entre les cases (px)
const STEP = CELL + GAP;
const RADIUS = 3; // arrondi des cases (px)
const BRUSH = 2.2; // rayon de la traînée, en cases
const DECAY = 0.94; // vitesse de retour à la teinte de base (par frame)

export function DotGrid({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    let cols = 0;
    let rows = 0;
    let base = new Float32Array(0); // opacité de base de chaque case
    let heat = new Float32Array(0); // assombrissement dû à la souris (0 → 1)
    let frame = 0;
    let last: { x: number; y: number } | null = null;

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / STEP) + 1;
      rows = Math.ceil(height / STEP) + 1;
      base = new Float32Array(cols * rows);
      heat = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // vignette : 1 au centre, ~0.25 sur les bords
          const dx = (c / cols - 0.5) * 2;
          const dy = (r / rows - 0.5) * 2;
          const vignette = Math.max(0.25, 1 - Math.hypot(dx * 0.8, dy) * 0.75);
          base[r * cols + c] = (0.04 + Math.random() * 0.08) * vignette;
        }
      }
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // couleur des cases = couleur du texte du thème courant (classe text-foreground)
      ctx.fillStyle = getComputedStyle(canvas).color;
      // grille centrée dans le parent
      const offsetX = (canvas.clientWidth - (cols * STEP - GAP)) / 2;
      const offsetY = (canvas.clientHeight - (rows * STEP - GAP)) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          ctx.globalAlpha = Math.min(1, base[i] + heat[i] * 0.6);
          ctx.beginPath();
          ctx.roundRect(offsetX + c * STEP, offsetY + r * STEP, CELL, CELL, RADIUS);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    // Boucle d'animation : ne tourne que tant qu'une traînée est visible
    const tick = () => {
      let active = false;
      for (let i = 0; i < heat.length; i++) {
        if (heat[i] > 0.005) {
          heat[i] *= DECAY;
          active = true;
        } else heat[i] = 0;
      }
      draw();
      frame = active ? requestAnimationFrame(tick) : 0;
    };

    // Chauffe les cases autour d'un point (coordonnées dans le parent)
    const stamp = (x: number, y: number) => {
      const offsetX = (canvas.clientWidth - (cols * STEP - GAP)) / 2;
      const offsetY = (canvas.clientHeight - (rows * STEP - GAP)) / 2;
      const cx = (x - offsetX) / STEP;
      const cy = (y - offsetY) / STEP;
      const reach = Math.ceil(BRUSH);
      for (let r = Math.floor(cy) - reach; r <= Math.floor(cy) + reach; r++) {
        for (let c = Math.floor(cx) - reach; c <= Math.floor(cx) + reach; c++) {
          if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
          const d = Math.hypot(c + 0.5 - cx, r + 0.5 - cy);
          const strength = 1 - d / BRUSH;
          const i = r * cols + c;
          if (strength > heat[i]) heat[i] = strength;
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      // interpole entre deux positions pour une traînée continue, même en mouvement rapide
      const from = last ?? point;
      const steps = Math.max(1, Math.ceil(Math.hypot(point.x - from.x, point.y - from.y) / (STEP / 2)));
      for (let s = 1; s <= steps; s++) {
        stamp(from.x + ((point.x - from.x) * s) / steps, from.y + ((point.y - from.y) * s) / steps);
      }
      last = point;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      last = null;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    // redessine quand le thème change (choix forcé ou préférence système)
    const themeObserver = new MutationObserver(() => draw());
    themeObserver.observe(document.documentElement, { attributeFilter: ["data-theme"] });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", draw);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      observer.disconnect();
      themeObserver.disconnect();
      media.removeEventListener("change", draw);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 text-foreground ${className}`} />
  );
}
