// Séparation entre deux sections : bande de 2rem sur toute la largeur de l'écran,
// remplie de fines lignes en biais (couleur des bordures, suit le thème).
// Même grille que Frame (px-2 > max-w-content) : les bordures de la colonne restent visibles.
export function Divider() {
  return (
    <div
      aria-hidden
      className="border-t border-border bg-[repeating-linear-gradient(-45deg,var(--border)_0_1px,transparent_1px_10px)] px-2"
    >
      <div className="mx-auto h-8 max-w-content border-x border-border" />
    </div>
  );
}
