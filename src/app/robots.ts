import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// /robots.txt : tout est indexable sauf l'API ; pointe vers le sitemap
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
