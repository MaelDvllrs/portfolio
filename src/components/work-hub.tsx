"use client";

import { useState } from "react";
import type { WorkProject } from "@/lib/cms";
import { Frame } from "@/components/frame";
import { placeholderFor } from "@/components/project-card";
import { WorkHubCard } from "@/components/work-hub-card";
import { MultiSelect } from "@/components/ui/multi-select";
import { BRANDS } from "@/components/ui/brands";
import { Divider } from "@/components/ui/divider";

// Séparateur, filtres (bande pleine largeur) + grille des projets de la page /work.
// Dans un filtre, les choix s'additionnent (OU) ; entre les deux filtres, ils se combinent (ET).
// Les options ne listent que les types et outils présents dans les projets.
export function WorkHub({ projects }: { projects: WorkProject[] }) {
  const [types, setTypes] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);

  const typeOptions = [...new Set(projects.map((p) => p.type).filter(Boolean))].map((t) => ({ value: t, label: t }));
  const toolOptions = [...new Set(projects.flatMap((p) => p.tools))].sort().map((t) => ({
    value: t,
    label: t,
    icon: BRANDS[t] ? (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 text-muted" aria-hidden>
        <path d={BRANDS[t].path} />
      </svg>
    ) : undefined,
  }));

  const filtered = projects.filter(
    (p) => (!types.length || types.includes(p.type)) && (!tools.length || tools.some((t) => p.tools.includes(t))),
  );
  const active = types.length + tools.length > 0;

  return (
    <>
      <Divider />
      <Frame as="div" className="flex flex-wrap items-center gap-2 py-3">
        {typeOptions.length > 0 && <MultiSelect label="Type" options={typeOptions} selected={types} onChange={setTypes} />}
        {toolOptions.length > 0 && <MultiSelect label="Tools" options={toolOptions} selected={tools} onChange={setTools} />}
        {active && (
          <button
            type="button"
            onClick={() => {
              setTypes([]);
              setTools([]);
            }}
            className="px-1 text-sm text-muted transition-colors hover:text-foreground"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-sm text-muted">
          {filtered.length} project{filtered.length === 1 ? "" : "s"}
        </span>
      </Frame>

      <Frame as="div" className="py-6">
        {filtered.length ? (
          <ul className="grid gap-6">
            {filtered.map((project) => (
              <li key={project.id}>
                {/* fond de remplacement selon la position d'origine : il ne change pas en filtrant */}
                <WorkHubCard
                  project={project}
                  placeholder={placeholderFor(projects.indexOf(project))}
                  sizes="(min-width: 50rem) 45rem, 85vw"
                  // une colonne : la photo garde la hauteur qu'elle avait en grille à 2 colonnes
                  // (≈ 12rem), elle s'élargit sans grandir ; 16/9 sur mobile
                  coverClassName="aspect-video sm:aspect-auto sm:h-48"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-sm text-muted">No project matches these filters.</p>
        )}
      </Frame>
    </>
  );
}
