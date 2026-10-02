import { BuildDashboard } from "./build-dashboard";

// Scène des étapes BUILD → INTELLIGENCE → SHIP.
// À SHIP (étape 4) : le dashboard rapetisse au milieu à gauche pendant qu'un nuage apparaît,
// puis il glisse dans le nuage en passant derrière (le nuage est au-dessus dans le DOM).
//
// Deux wrappers car chaque élément n'a qu'une animation :
// - intérieur  : "shrink-left" (rapetisse et part à gauche, centre à ~22 % de la largeur) ;
// - extérieur  : "into-cloud", origine posée sur ce centre pour que le scale ne le déplace pas,
//   puis translation jusqu'au centre du nuage (~70 %).

const SHIP_STEP = 3;

export function DashboardScene() {
  return (
    <div className="relative h-full w-full">
      <div
        className="h-full w-full"
        style={{ transformOrigin: "22% 50%" }}
        data-anim="into-cloud"
        data-at={SHIP_STEP}
        data-order={1}
        data-duration={1}
      >
        <div
          className="h-full w-full"
          data-anim="shrink-left"
          data-at={SHIP_STEP}
          data-order={0}
          data-duration={1}
        >
          <BuildDashboard />
        </div>
      </div>

      {/* Nuage, centré à ~70 % de la largeur, au-dessus du dashboard */}
      {/* (centrage sur le wrapper, animation sur l'enfant : pas de conflit de transform) */}
      <div className="pointer-events-none absolute top-1/2 left-[70%] w-[36%] -translate-x-1/2 -translate-y-1/2">
        <div
          style={{ opacity: 0, transform: "scale(0.8)" }}
          data-anim="pop"
          data-at={SHIP_STEP}
          data-order={0}
          data-duration={0.6}
        >
          <CloudIcon />
        </div>
      </div>
    </div>
  );
}

// Nuage plein (blanc) au contour noir : il masque le dashboard qui passe derrière.
// Tracé inspiré de l'icône "cloud" de Lucide (licence ISC).
function CloudIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-auto w-full drop-shadow-sm" aria-label="Cloud" role="img">
      <path
        d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
        fill="white"
        stroke="#171717"
        strokeWidth={0.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}
