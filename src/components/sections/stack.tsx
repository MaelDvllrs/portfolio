import { useTranslations } from "next-intl";
import { Frame } from "@/components/frame";
import { SectionTitle } from "@/components/section";
import { BRANDS } from "@/components/ui/brands";

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
  const t = useTranslations("Stack");
  // outils dans l'ordre des messages ; `name` = clé de BRANDS (liste, et non objet : les noms
  // comme « Next.js » contiennent un point, interdit dans les clés de next-intl)
  const stack = {
    title: t("title"),
    tools: t.raw("tools") as { name: string; description: string }[],
  };
  return (
    <section id="stack" className="scroll-mt-20">
      <SectionTitle>{stack.title}</SectionTitle>
      <Frame as="div" bleed>

        {/* Quadrillage de carrés collés aux bordures de la section (cadre `bleed`).
            Chaque case a une bordure droite + basse ; le wrapper rogne celles de la dernière
            colonne et de la dernière ligne (-mr-px / -mb-px + overflow-hidden). */}
        <div className="overflow-hidden">
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
                    className={`absolute inset-0 flex translate-y-[calc(100%+2px)] flex-col justify-between p-2.5 transition-transform sm:p-3 ${EASE} group-hover:translate-y-0 group-focus-visible:translate-y-0`}
                    style={{ backgroundColor: brand?.color, color: brand?.text }}
                  >
                    <div className="flex items-center gap-2">
                      {brand && <Logo path={brand.path} className="size-5" />}
                      <span className="text-sm font-medium">{tool.name}</span>
                    </div>
                    <p className="line-clamp-4 text-xs leading-snug">{tool.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Frame>
    </section>
  );
}
