"use client";

// Applique le thème choisi avant le premier rendu (évite un flash). Sans choix enregistré : pas
// d'attribut, le site suit le système.
// - Rendu serveur (HTML initial) : <script> normal, exécuté immédiatement par le navigateur.
// - Rendus côté client (ex. changement de langue, qui re-rend le layout racine) : type
//   « text/plain ». React ne crée alors pas de script exécutable et n'affiche pas l'avertissement
//   « Encountered a script tag… » ; le thème est de toute façon déjà appliqué à ce moment-là.
//   suppressHydrationWarning : ignore la différence d'attribut `type` à l'hydratation.
const CODE = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function ThemeScript() {
  return (
    <script
      suppressHydrationWarning
      type={typeof window === "undefined" ? undefined : "text/plain"}
      dangerouslySetInnerHTML={{ __html: CODE }}
    />
  );
}
