const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:pointer-events-none disabled:opacity-40";

// Ombres internes : reflet clair en haut + ombre en bas → effet d'épaisseur.
const variants = {
  // couleur du texte du thème (noir en clair, blanc en sombre), texte de la couleur du fond.
  // (survol via la couleur de fond, pas l'opacité : une transition d'opacité casserait les
  // fondus GSAP appliqués aux boutons)
  primary:
    "border border-white/10 bg-foreground text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_6px_rgba(255,255,255,0.12),inset_0_-2px_3px_rgba(0,0,0,0.5)] hover:bg-foreground/85",
  // bordé, aux couleurs du thème (fond de page)
  secondary:
    "border border-border bg-background text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-2px_3px_rgba(0,0,0,0.06)] hover:bg-surface",
  brand:
    "bg-white text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_3px_rgba(0,0,0,0.12)] hover:bg-neutral-100",
  glass:
    "border border-white/20 bg-white/10 text-white backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_3px_rgba(0,0,0,0.2)] hover:bg-white/15",
};

// L'arrondi dépend de la taille (un petit bouton garde des coins discrets)
const sizes = {
  sm: "rounded-xl px-4 py-2 text-sm",
  default: "rounded-xl px-6 py-3 text-sm",
  lg: "rounded-xl px-8 py-4 text-base",
  icon: "size-11 rounded-xl text-sm",
  // bouton icône compact (navigation entre articles)
  "icon-sm": "size-5 rounded-[5px] text-xs",
};

type ButtonStyle = { variant?: keyof typeof variants; size?: keyof typeof sizes };

const classes = ({ variant = "primary", size = "default" }: ButtonStyle, className = "") =>
  `${base} ${variants[variant]} ${sizes[size]} ${className}`;

export function ButtonLink({
  variant = "brand",
  size,
  className,
  ...props
}: React.ComponentProps<"a"> & ButtonStyle) {
  return <a className={classes({ variant, size }, className)} {...props} />;
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & ButtonStyle) {
  return <button type={type} className={classes({ variant, size }, className)} {...props} />;
}
