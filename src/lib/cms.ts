import { site } from "@/content/site";

// Client du CMS Payload (projet séparé `portfolio-cms`, servi sur cms.monsite.fr).
// Les données sont mises en cache avec un tag ; le CMS appelle /api/revalidate après chaque
// modification pour invalider ce tag. Si le CMS n'est pas configuré ou ne répond pas,
// on retombe sur le contenu statique de src/content/site.ts : le site reste toujours affichable.

const CMS_URL = process.env.CMS_URL;

export const CMS_TAGS = { projects: "projects", clients: "clients" } as const;

// Forme utilisée par l'interface (indépendante du format de l'API)
export type WorkProject = {
  id: string;
  name: string;
  description: string;
  type: string;
  stack: string[];
  image: { url: string; alt: string } | null;
  logo: { url: string; alt: string } | null;
  href: string;
};

// Sous-ensemble des types générés par Payload (portfolio-cms/src/payload-types.ts).
// À garder synchronisé si la collection `projects` change.
type CmsMedia = { url?: string | null; alt: string };
type CmsProject = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  type: "saas" | "ai" | "web" | "internal-tool" | "software";
  url?: string | null;
  image?: number | CmsMedia | null;
  logo?: number | CmsMedia | null;
  stack?: { name: string }[] | null;
};

const TYPE_LABELS: Record<CmsProject["type"], string> = {
  saas: "SaaS",
  ai: "AI",
  web: "Web",
  "internal-tool": "Internal tool",
  software: "Software",
};

// En stockage local, Payload renvoie une URL relative (/api/media/file/…) : on la rend absolue
function toMedia(media: CmsProject["image"]): WorkProject["image"] {
  if (!media || typeof media === "number" || !media.url) return null;
  const url = media.url.startsWith("http") ? media.url : `${CMS_URL}${media.url}`;
  // encodeURI : les noms de fichiers peuvent contenir des espaces (« Group 26.png »)
  return { url: encodeURI(url), alt: media.alt };
}

function fromCms(project: CmsProject): WorkProject {
  return {
    id: String(project.id),
    name: project.name,
    description: project.description ?? "",
    type: TYPE_LABELS[project.type],
    stack: project.stack?.map((s) => s.name) ?? [],
    image: toMedia(project.image),
    logo: toMedia(project.logo),
    href: project.url || "#",
  };
}

function staticProjects(): WorkProject[] {
  return site.work.projects.map((p) => ({
    id: p.name,
    name: p.name,
    description: p.description,
    type: p.type,
    stack: p.stack,
    image: p.image ? { url: p.image, alt: "" } : null,
    logo: p.logo ? { url: p.logo, alt: `${p.name} logo` } : null,
    href: p.href,
  }));
}

/** Projets de la section « Selected work », triés par `order`. */
export async function getProjects(): Promise<WorkProject[]> {
  if (!CMS_URL) return staticProjects();

  const params = new URLSearchParams({
    depth: "1", // inclut les médias (image, logo)
    sort: "order",
    limit: "20",
    "where[_status][equals]": "published",
  });

  try {
    const res = await fetch(`${CMS_URL}/api/projects?${params}`, {
      cache: "force-cache",
      next: { tags: [CMS_TAGS.projects] },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: { docs: CmsProject[] } = await res.json();
    return data.docs.length ? data.docs.map(fromCms) : staticProjects();
  } catch (error) {
    console.error("[cms] Impossible de charger les projets, contenu statique utilisé :", error);
    return staticProjects();
  }
}

// --- Bandeau de logos ---------------------------------------------------------------------

export type ClientLogo = {
  id: string;
  name: string;
  logo: { url: string; alt: string };
  href: string | null;
};

type CmsClient = { id: number; name: string; logo: number | CmsMedia; url?: string | null };

// Logos ajoutés en statique dans site.ts (toujours affichés, en premier)
function staticClients(): ClientLogo[] {
  return site.clients.map((c) => ({
    id: `static-${c.name}`,
    name: c.name,
    logo: { url: c.logo.src, alt: `Logo ${c.name}` },
    href: null,
  }));
}

/**
 * Logos du bandeau défilant : les logos statiques de site.ts, puis les clients du CMS
 * (collection `clients`), puis les logos des projets publiés de « Selected work »
 * (sans doublon de nom). Sans CMS : seulement les logos statiques.
 */
export async function getClientLogos(): Promise<ClientLogo[]> {
  if (!CMS_URL) return staticClients();

  try {
    const params = new URLSearchParams({ depth: "1", sort: "order", limit: "50" });
    const [res, projects] = await Promise.all([
      fetch(`${CMS_URL}/api/clients?${params}`, {
        cache: "force-cache",
        next: { tags: [CMS_TAGS.clients] },
      }),
      getProjects(),
    ]);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: { docs: CmsClient[] } = await res.json();

    const logos = staticClients();
    for (const c of data.docs) {
      const logo = toMedia(c.logo);
      if (logo) logos.push({ id: `client-${c.id}`, name: c.name, logo, href: c.url || null });
    }
    const names = new Set(logos.map((l) => l.name.toLowerCase()));
    for (const p of projects) {
      if (p.logo && !names.has(p.name.toLowerCase())) {
        logos.push({ id: `project-${p.id}`, name: p.name, logo: p.logo, href: p.href === "#" ? null : p.href });
      }
    }
    return logos;
  } catch (error) {
    console.error("[cms] Impossible de charger les logos, contenu statique utilisé :", error);
    return staticClients();
  }
}
