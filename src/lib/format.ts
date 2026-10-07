// « 2026-10-07T… » → « Oct 7, 2026 » (UTC : même rendu sur le serveur et dans le navigateur)
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
