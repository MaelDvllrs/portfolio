import { slugify } from "@/lib/slugify";
import type { Heading } from "@/components/table-of-contents";

// Ajoute un id à chaque <h3> du HTML du CMS (ancre pour le menu) et renvoie la liste des titres.
// Ids uniques : un titre répété reçoit un suffixe (-2, -3…).
export function withHeadingIds(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const used = new Map<string, number>();

  const out = html.replace(/<h3([^>]*)>([\s\S]*?)<\/h3>/g, (match, attrs: string, inner: string) => {
    const text = decodeEntities(inner.replace(/<[^>]+>/g, "")).trim();
    if (!text || /\sid=/.test(attrs)) return match;
    const base = slugify(text) || "section";
    const count = (used.get(base) ?? 0) + 1;
    used.set(base, count);
    const id = count > 1 ? `${base}-${count}` : base;
    headings.push({ id, text });
    return `<h3${attrs} id="${id}">${inner}</h3>`;
  });

  return { html: out, headings };
}

/** Temps de lecture estimé en minutes (≈ 220 mots/min, 1 minute minimum). */
export function readingTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

// Entités courantes du HTML généré (le texte du menu est rendu par React, pas en HTML)
const decodeEntities = (text: string) =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
