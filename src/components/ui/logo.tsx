// Logo du portfolio (src/assets/image/logo.svg), en currentColor pour suivre la couleur du texte.
// `outline` : sans remplissage, seulement le contour (trait de 1px quelle que soit la taille).
export const LOGO_VIEWBOX = { width: 245, height: 203 };
export const LOGO_PATHS = [
  "M133.349 112.44C136.126 114.435 136.126 118.565 133.349 120.56L42.6677 185.722C39.3598 188.099 34.75 185.735 34.75 181.661L34.75 51.3387C34.75 47.2653 39.3598 44.9013 42.6677 47.2783L133.349 112.44Z",
  "M111.651 90.5604C108.874 88.5654 108.874 84.4346 111.651 82.4396L202.332 17.2783C205.64 14.9013 210.25 17.2653 210.25 21.3387V151.661C210.25 155.735 205.64 158.099 202.332 155.722L111.651 90.5604Z",
];

export function Logo({ className = "h-6 w-auto", outline = false }: { className?: string; outline?: boolean }) {
  const paint = outline
    ? ({ fill: "none", stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" } as const)
    : ({ fill: "currentColor" } as const);
  return (
    <svg viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`} className={className} aria-hidden>
      {LOGO_PATHS.map((d) => (
        <path key={d} {...paint} d={d} />
      ))}
    </svg>
  );
}
