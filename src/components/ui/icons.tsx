// Icônes (tracés inspirés de Lucide, licence ISC)
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SunIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} {...stroke}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function MoonIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function MonitorIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} {...stroke}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

// Flèche vers la droite (la faire pivoter de 180° pour la gauche)
export function ArrowIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

// Repère de localisation
export function PinIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// Horloge
export function ClockIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
