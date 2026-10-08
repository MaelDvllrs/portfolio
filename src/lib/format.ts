// « 2026-10-07T… » → « Oct 7, 2026 » (en) / « 7 oct. 2026 » (fr). UTC : même rendu sur le serveur
// et dans le navigateur.
export const formatDate = (iso: string, locale = "en") =>
  new Date(iso).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
