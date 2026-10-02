import {
  siClaude,
  siCloudflare,
  siDocker,
  siExpress,
  siGithub,
  siModelcontextprotocol,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWebflow,
} from "simple-icons";
import { site } from "@/content/site";
import { Frame } from "@/components/frame";
import { h2Class } from "@/components/section";
import { OPENAI_PATH } from "@/components/ui/ai-logos";

// Logo (tracé SVG 24×24), couleur de marque et couleur du texte posé dessus.
// Logos : simple-icons (CC0), sauf OpenAI (lobe-icons, MIT — absent de simple-icons).
const DARK = "#0a0a0a";
const LIGHT = "#ffffff";
const BRANDS: Record<string, { path: string; color: string; text: string }> = {
  React: { path: siReact.path, color: `#${siReact.hex}`, text: DARK },
  "Next.js": { path: siNextdotjs.path, color: "#000000", text: LIGHT },
  TypeScript: { path: siTypescript.path, color: `#${siTypescript.hex}`, text: LIGHT },
  "Tailwind CSS": { path: siTailwindcss.path, color: `#${siTailwindcss.hex}`, text: DARK },
  Webflow: { path: siWebflow.path, color: `#${siWebflow.hex}`, text: LIGHT },
  "Node.js": { path: siNodedotjs.path, color: `#${siNodedotjs.hex}`, text: LIGHT },
  Express: { path: siExpress.path, color: "#000000", text: LIGHT },
  NestJS: { path: siNestjs.path, color: `#${siNestjs.hex}`, text: LIGHT },
  PostgreSQL: { path: siPostgresql.path, color: `#${siPostgresql.hex}`, text: LIGHT },
  MongoDB: { path: siMongodb.path, color: `#${siMongodb.hex}`, text: LIGHT },
  Supabase: { path: siSupabase.path, color: `#${siSupabase.hex}`, text: DARK },
  Claude: { path: siClaude.path, color: `#${siClaude.hex}`, text: LIGHT },
  OpenAI: { path: OPENAI_PATH, color: "#000000", text: LIGHT },
  MCP: { path: siModelcontextprotocol.path, color: "#000000", text: LIGHT },
  Vercel: { path: siVercel.path, color: "#000000", text: LIGHT },
  Cloudflare: { path: siCloudflare.path, color: `#${siCloudflare.hex}`, text: DARK },
  Docker: { path: siDocker.path, color: `#${siDocker.hex}`, text: LIGHT },
  GitHub: { path: siGithub.path, color: `#${siGithub.hex}`, text: LIGHT },
};

// Même courbe pour les deux calques : le haut du panneau coloré suit exactement
// le bas du logo qui s'aplatit.
const EASE = "duration-500 ease-[cubic-bezier(0.7,0,0.2,1)]";

function Logo({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={path} />
    </svg>
  );
}

export function Stack() {
  const { stack } = site;
  return (
    <Frame id="stack" className="pt-20 lg:pt-28">
      <h2 className={`${h2Class} text-center`}>{stack.title}</h2>

      {/* Quadrillage de carrés collés aux bordures de la section (-mx-6).
          Chaque case a une bordure droite + basse ; le wrapper rogne celles de la dernière
          colonne et de la dernière ligne (-mr-px / -mb-px + overflow-hidden). */}
      <div className="-mx-6 mt-16 overflow-hidden border-t border-border">
        <ul className="-mr-px -mb-px grid grid-cols-3 lg:grid-cols-6">
          {stack.tools.map((tool) => {
            const brand = BRANDS[tool.name];
            return (
              <li
                key={tool.name}
                tabIndex={0}
                className="group relative aspect-square overflow-hidden border-r border-b border-border outline-none"
              >
                {/* Logo : s'aplatit vers le haut au survol */}
                <div
                  className={`absolute inset-0 flex origin-top items-center justify-center text-foreground transition-transform ${EASE} group-hover:scale-y-0 group-focus-visible:scale-y-0`}
                >
                  {brand && <Logo path={brand.path} className="size-10 sm:size-12" />}
                  <span className="sr-only">{tool.name}</span>
                </div>

                {/* Panneau à la couleur du logo : monte depuis le bas (caché 2px plus bas que la
                    case, sinon l'arrondi des pixels laisse dépasser une ligne de couleur) */}
                <div
                  className={`absolute inset-0 flex translate-y-[calc(100%+2px)] flex-col justify-between p-4 transition-transform sm:p-5 ${EASE} group-hover:translate-y-0 group-focus-visible:translate-y-0`}
                  style={{ backgroundColor: brand?.color, color: brand?.text }}
                >
                  <div className="flex items-center gap-2">
                    {brand && <Logo path={brand.path} className="size-5" />}
                    <span className="text-sm font-medium">{tool.name}</span>
                  </div>
                  <p className="line-clamp-3 text-xs leading-snug sm:text-sm">{tool.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Frame>
  );
}
