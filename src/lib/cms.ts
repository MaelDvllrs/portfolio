import { site } from "@/content/site";
import { slugify } from "@/lib/slugify";
import { ILLUSTRATIONS, type IllustrationKey } from "@/components/service-illustrations";

// Client du CMS Payload (projet séparé `portfolio-cms`, servi sur cms.monsite.fr).
// Les données sont mises en cache avec un tag ; le CMS appelle /api/revalidate après chaque
// modification pour invalider ce tag. Si le CMS n'est pas configuré ou ne répond pas,
// on retombe sur le contenu statique de src/content/site.ts : le site reste toujours affichable.

const CMS_URL = process.env.CMS_URL;

export const CMS_TAGS = { projects: "projects", clients: "clients", posts: "posts", services: "services" } as const;

// Forme utilisée par l'interface (indépendante du format de l'API)
export type WorkProject = {
  id: string;
  /** Page du projet : /work/<slug> */
  slug: string;
  name: string;
  description: string;
  type: string;
  /** Noms des outils, tels que dans BRANDS (src/components/ui/brands.ts) */
  tools: string[];
  /** Période affichée : « 2024 », « 2023 – 2025 », « 2024 – now » (null si pas d'année) */
  period: string | null;
  image: { url: string; alt: string } | null;
  logo: { url: string; alt: string } | null;
  /** Lien externe du projet (site, démo…), ou null */
  url: string | null;
  /** Étude de cas en HTML (champ `contentHtml` du CMS), vide si non rédigée */
  contentHtml: string;
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
  startYear?: number | null;
  endYear?: number | null;
  ongoing?: boolean | null;
  contentHtml?: string | null;
  image?: number | CmsMedia | null;
  logo?: number | CmsMedia | null;
  tools?: string[] | null;
};

const TYPE_LABELS: Record<CmsProject["type"], string> = {
  saas: "SaaS",
  ai: "AI",
  web: "Web",
  "internal-tool": "Internal tool",
  software: "Software",
};

// Valeurs du select `tools` du CMS → noms affichés (à garder synchronisé avec
// TOOL_OPTIONS dans portfolio-cms/src/collections/Projects.ts)
const TOOL_LABELS: Record<string, string> = {
  react: "React",
  nextjs: "Next.js",
  typescript: "TypeScript",
  tailwind: "Tailwind CSS",
  webflow: "Webflow",
  nodejs: "Node.js",
  express: "Express",
  nestjs: "NestJS",
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  supabase: "Supabase",
  claude: "Claude",
  openai: "OpenAI",
  mcp: "MCP",
  vercel: "Vercel",
  cloudflare: "Cloudflare",
  docker: "Docker",
  github: "GitHub",
};

type Period = { startYear?: number | null; endYear?: number | null; ongoing?: boolean | null };

// Une seule année si le projet tient dans l'année (pas de fin, ou fin = début)
export function formatPeriod({ startYear, endYear, ongoing }: Period): string | null {
  if (!startYear) return null;
  if (ongoing) return `${startYear} – now`;
  if (!endYear || endYear === startYear) return String(startYear);
  return `${startYear} – ${endYear}`;
}

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
    slug: project.slug,
    name: project.name,
    description: project.description ?? "",
    type: TYPE_LABELS[project.type],
    tools: project.tools?.map((t) => TOOL_LABELS[t] ?? t) ?? [],
    period: formatPeriod(project),
    image: toMedia(project.image),
    logo: toMedia(project.logo),
    url: project.url || null,
    contentHtml: unwrapRichText(project.contentHtml),
  };
}

// Le HTML de Lexical est enveloppé dans <div class="payload-richtext"> : on retire cette
// enveloppe pour que les styles de .prose-content visent directement les paragraphes et titres
// (sélecteurs `> h3`, `> * + *`), et pour détecter un texte vide (enveloppe seule → "").
function unwrapRichText(html: string | null | undefined): string {
  const inner = (html ?? "")
    .trim()
    .replace(/^<div class="payload-richtext">([\s\S]*)<\/div>$/, "$1")
    .trim();
  // vide, ou seulement des paragraphes vides (<p></p>, <p><br></p>)
  return inner.replace(/<p>(\s|<br\s*\/?>)*<\/p>/g, "").trim() ? inner : "";
}

function staticProjects(): WorkProject[] {
  return site.work.projects.map((p) => ({
    id: p.name,
    slug: slugify(p.name),
    name: p.name,
    description: p.description,
    type: p.type,
    tools: p.tools,
    period: formatPeriod(p),
    image: p.image ? { url: p.image, alt: "" } : null,
    logo: p.logo ? { url: p.logo, alt: `${p.name} logo` } : null,
    url: p.url,
    contentHtml: "",
  }));
}

/** Projets publiés (accueil, /work et pages projet), triés par `order`. */
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

/** Un projet par son slug (page /work/<slug>), ou null s'il n'existe pas / n'est pas publié. */
export async function getProject(slug: string): Promise<WorkProject | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

// --- Services -----------------------------------------------------------------------------

export type Service = {
  id: string;
  /** Page du service : /services/<slug> */
  slug: string;
  name: string;
  summary: string;
  /** Illustration minimaliste choisie dans le CMS (prioritaire sur la couverture), ou null */
  illustration: IllustrationKey | null;
  cover: { url: string; alt: string } | null;
  /** Noms des outils, tels que dans BRANDS (src/components/ui/brands.ts) */
  tools: string[];
  /** Points clés (3 cartes titre + texte) de la page du service */
  highlights: { title: string; text: string }[];
  /** Section « What can I build » : texte à gauche, visuel (illustration codée) à droite */
  builds: { title: string; text: string; visual: IllustrationKey }[];
  /** Ids des projets liés (réalisations du slider de la page), dans l'ordre choisi dans le CMS */
  projectIds: string[];
  /** Explication complète en HTML (champ `contentHtml` du CMS), vide si non rédigée */
  contentHtml: string;
  faq: { question: string; answer: string }[];
  /** SEO : valeurs du CMS, sinon nom et résumé */
  metaTitle: string;
  metaDescription: string;
};

// Sous-ensemble du type `Service` généré par Payload (portfolio-cms/src/payload-types.ts)
type CmsService = {
  id: number;
  name: string;
  slug: string;
  summary: string;
  illustration?: string | null;
  cover?: number | CmsMedia | null;
  tools?: string[] | null;
  highlights?: { title: string; text: string }[] | null;
  builds?: { title: string; text: string; visual: string }[] | null;
  projects?: (number | { id: number })[] | null;
  contentHtml?: string | null;
  faq?: { question: string; answer: string }[] | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

function serviceFromCms(service: CmsService): Service {
  return {
    id: String(service.id),
    slug: service.slug,
    name: service.name,
    summary: service.summary,
    // une valeur inconnue (illustration pas encore dessinée côté portfolio) est ignorée
    illustration:
      service.illustration && service.illustration in ILLUSTRATIONS
        ? (service.illustration as IllustrationKey)
        : null,
    cover: toMedia(service.cover),
    tools: service.tools?.map((t) => TOOL_LABELS[t] ?? t) ?? [],
    highlights: service.highlights?.map(({ title, text }) => ({ title, text })) ?? [],
    // visuel inconnu (pas encore dessiné côté portfolio) : l'élément est ignoré
    builds:
      service.builds
        ?.filter((b) => b.visual in ILLUSTRATIONS)
        .map(({ title, text, visual }) => ({ title, text, visual: visual as IllustrationKey })) ?? [],
    // avec depth=1 les projets arrivent peuplés (objets), sinon ce sont des ids
    projectIds: service.projects?.map((p) => String(typeof p === "number" ? p : p.id)) ?? [],
    contentHtml: unwrapRichText(service.contentHtml),
    faq: service.faq?.map(({ question, answer }) => ({ question, answer })) ?? [],
    metaTitle: service.metaTitle || service.name,
    metaDescription: service.metaDescription || service.summary,
  };
}

/** Services publiés, triés par `order`. Sans CMS : aucun service. */
export async function getServices(): Promise<Service[]> {
  if (!CMS_URL) return [];

  const params = new URLSearchParams({
    depth: "1", // inclut la couverture
    sort: "order",
    limit: "50",
    "where[_status][equals]": "published",
  });

  try {
    const res = await fetch(`${CMS_URL}/api/services?${params}`, {
      cache: "force-cache",
      next: { tags: [CMS_TAGS.services] },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: { docs: CmsService[] } = await res.json();
    return data.docs.map(serviceFromCms);
  } catch (error) {
    console.error("[cms] Impossible de charger les services :", error);
    return [];
  }
}

/** Un service par son slug (page /services/<slug>), ou null s'il n'existe pas / n'est pas publié. */
export async function getService(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
}

// --- Blog ---------------------------------------------------------------------------------

export type BlogPost = {
  id: string;
  /** Page de l'article : /blog/<slug> */
  slug: string;
  title: string;
  excerpt: string;
  cover: { url: string; alt: string } | null;
  /** Article en HTML (champ `contentHtml` du CMS) */
  contentHtml: string;
  tags: string[];
  /** Auteur (profil public du CMS), ou null si aucun auteur n'est lié */
  author: { name: string; jobTitle: string | null; avatar: { url: string; alt: string } | null } | null;
  /** Questions fréquentes affichées en bas de l'article */
  faq: { question: string; answer: string }[];
  /** Date ISO de publication */
  publishedAt: string;
  /** Date ISO de dernière modification (sitemap, JSON-LD) */
  updatedAt: string;
  /** SEO : valeurs du CMS, sinon titre et résumé */
  metaTitle: string;
  metaDescription: string;
};

// Sous-ensemble du type `Post` généré par Payload (portfolio-cms/src/payload-types.ts)
type CmsPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover?: number | CmsMedia | null;
  contentHtml?: string | null;
  tags?: string[] | null;
  faq?: { question: string; answer: string }[] | null;
  /** Champ virtuel du CMS : profil public de l'auteur (les utilisateurs ne sont pas publics) */
  authorProfile?: { name: string | null; jobTitle: string | null; avatar: CmsMedia | null } | null;
  publishedAt: string;
  updatedAt: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

function postFromCms(post: CmsPost): BlogPost {
  return {
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    cover: toMedia(post.cover),
    contentHtml: unwrapRichText(post.contentHtml),
    tags: post.tags ?? [],
    faq: post.faq?.map(({ question, answer }) => ({ question, answer })) ?? [],
    author: post.authorProfile?.name
      ? {
          name: post.authorProfile.name,
          jobTitle: post.authorProfile.jobTitle,
          avatar: toMedia(post.authorProfile.avatar),
        }
      : null,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    metaTitle: post.metaTitle || post.title,
    metaDescription: post.metaDescription || post.excerpt,
  };
}

/** Articles publiés, du plus récent au plus ancien. Sans CMS : aucun article. */
export async function getPosts(): Promise<BlogPost[]> {
  if (!CMS_URL) return [];

  const params = new URLSearchParams({
    depth: "1", // inclut la couverture
    sort: "-publishedAt",
    limit: "100",
    "where[_status][equals]": "published",
  });

  try {
    const res = await fetch(`${CMS_URL}/api/posts?${params}`, {
      cache: "force-cache",
      next: { tags: [CMS_TAGS.posts] },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: { docs: CmsPost[] } = await res.json();
    return data.docs.map(postFromCms);
  } catch (error) {
    console.error("[cms] Impossible de charger les articles :", error);
    return [];
  }
}

/** Un article par son slug (page /blog/<slug>), ou null s'il n'existe pas / n'est pas publié. */
export async function getPost(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
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
        logos.push({ id: `project-${p.id}`, name: p.name, logo: p.logo, href: p.url });
      }
    }
    return logos;
  } catch (error) {
    console.error("[cms] Impossible de charger les logos, contenu statique utilisé :", error);
    return staticClients();
  }
}
