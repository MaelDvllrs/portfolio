"use client";

import { cloneElement } from "react";
import dynamic from "next/dynamic";
import "react-github-calendar/tooltips.css";
import { site } from "@/content/site";
import { Section } from "@/components/section";

// Rendu uniquement dans le navigateur : l'état de chargement de la librairie dépend de réglages
// du navigateur (mouvement réduit, thème), le HTML serveur ne correspondrait pas (erreur
// d'hydratation). Placeholder de la même hauteur pour éviter un saut de mise en page.
const GitHubCalendar = dynamic(() => import("react-github-calendar").then((m) => m.GitHubCalendar), {
  ssr: false,
  loading: () => <div className="h-[9.5rem]" />,
});

// Intensité de chaque niveau (0 → 4) : mélange de la couleur du texte dans le fond.
// En sombre : quasi noir quand il y a peu de contributions, blanc quand il y en a beaucoup.
const LEVEL_MIX = [0, 25, 50, 75, 100];
const fillFor = (level: number) =>
  level === 0
    ? "var(--surface)"
    : `color-mix(in oklab, var(--foreground) ${LEVEL_MIX[level]}%, var(--surface))`;

// La librairie pose la couleur en attribut SVG `fill`, qui ne lit pas les variables CSS :
// on la repasse en style pour suivre le thème du site (data-theme ou système).
const recolor = (block: React.ReactElement<React.SVGProps<SVGRectElement>>, level: number) =>
  cloneElement(block, { style: { ...block.props.style, fill: fillFor(level) } });

// Légende (less → more) : la case est un <rect> enveloppé dans un <svg>, on recolore le <rect>
// (les types de la librairie le déclarent à tort comme un <rect>)
const recolorLegend = (block: React.ReactElement<{ children?: React.ReactNode }>, level: number) =>
  cloneElement(block, {
    children: recolor(block.props.children as React.ReactElement<React.SVGProps<SVGRectElement>>, level),
  });

// Grille des contributions GitHub (données réelles du profil public, chargées à chaque visite
// via l'API github-contributions-api.jogruber.de, utilisée par react-github-calendar).
export function GitHub() {
  const { github } = site;
  return (
    <Section id="github" title={github.title}>
      <a
        href={`https://github.com/${github.username}`}
        target="_blank"
        rel="noreferrer"
        className="mb-6 inline-block text-sm text-muted transition-colors hover:text-foreground"
      >
        @{github.username}
      </a>
      <GitHubCalendar
        username={github.username}
        blockSize={11}
        blockMargin={3}
        blockRadius={2}
        fontSize={12}
        className="text-muted"
        renderBlock={(block, activity) => recolor(block, activity.level)}
        renderColorLegend={(block, level) => recolorLegend(block, level)}
        labels={{ totalCount: "{{count}} contributions in the last year" }}
        tooltips={{
          activity: {
            text: (a) => `${a.count} contribution${a.count === 1 ? "" : "s"} on ${a.date}`,
          },
        }}
      />
    </Section>
  );
}
