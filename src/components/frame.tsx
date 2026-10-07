// Cadre commun à toutes les sections (hero compris) :
// - bordure horizontale en haut, sur toute la largeur de l'écran ;
// - bordures verticales sur les bords de la colonne de contenu, sur toute la hauteur ;
// - 0.5rem de marge minimum à l'extérieur des bordures verticales (visibles sur mobile) ;
// - 1.5rem de padding horizontal minimum à l'intérieur des bordures (`bleed` le retire,
//   pour un contenu collé aux bordures).
// Le header reprend la même grille (px-2 > max-w-content > px-6).
export function Frame({
  as: Tag = "section",
  bleed = false,
  className = "",
  children,
  ...props
}: {
  as?: "section" | "footer" | "div";
  bleed?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  return (
    <Tag className="scroll-mt-20 border-t border-border px-2" {...props}>
      <div
        className={`mx-auto max-w-content border-x border-border ${bleed ? "" : "px-6"} ${className}`}
      >
        {children}
      </div>
    </Tag>
  );
}
