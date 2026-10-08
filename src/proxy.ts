import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Ajoute la langue aux URL sans préfixe (« / » → /en ou /fr selon le navigateur ou le cookie)
export default createMiddleware(routing);

export const config = {
  // tout sauf l'API, les fichiers internes de Next et les fichiers (sitemap.xml, robots.txt, icônes…)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
