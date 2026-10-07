// Contenu de la landing page — modifie ici sans toucher aux composants.
// TODO : remplacer les valeurs marquées TODO par les vraies infos.
import atolLogo from "@/assets/image/logo-client/6a33a896555ec73bd8b311d3_atol.png";
import techAndFestLogo from "@/assets/image/logo-client/TECH-AND-FEST-LOGO-BLANC-RVB.avif";

export const site = {
  name: "Maël Devillers",
  role: "Fullstack Developer · AI · Product",
  email: "mael.devillers@gmail.com",
  // URL publique du site (liens canoniques, sitemap, Open Graph) : variable SITE_URL en production
  url: process.env.SITE_URL ?? "http://localhost:3000",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mael-devillers-b12a5b236" },
    { label: "GitHub", href: "https://github.com/MaelDvllrs" },
    { label: "X", href: "https://x.com/marl_2304" },
  ],

  // En-tête façon profil (src/components/sections/hero.tsx)
  profile: {
    name: "Mael",
    handle: "@trymael",
    bio: ["Fullstack developer building web products, SaaS and AI-powered experiences from idea to production."],
    location: "Paris, France",
    timeZone: "Europe/Paris", // heure affichée à côté de la localisation
  },

  // Logos du bandeau ajoutés en statique (fichiers dans src/assets/image/logo-client).
  // Les logos venant du CMS (projets publiés, collection Clients) s'y ajoutent.
  clients: [
    { name: "Atol", logo: atolLogo },
    { name: "Tech and Fest", logo: techAndFestLogo },
  ],

  // Pages /blog
  blog: {
    title: "Blog",
    intro: "Notes on building web products, SaaS and AI tools: what worked, what didn't.", // TODO : à ajuster
  },

  // Page /work (hub de tous les projets)
  workHub: {
    title: "Work",
    intro: "Products, SaaS and AI tools I designed and built, from idea to production.", // TODO : à ajuster
  },

  work: {
    title: "Selected work",
    projects: [
      {
        name: "Wenoble Dashboard",
        description: "TODO — one sentence describing the product.",
        type: "SaaS",
        // TODO : période du projet
        startYear: null as number | null,
        endYear: null as number | null,
        ongoing: false,
        tools: ["Next.js", "TypeScript", "Supabase"],
        image: null as string | null, // TODO : image de fond de la card (16/9)
        logo: null as string | null, // TODO : logo du projet
        url: null as string | null, // TODO : lien externe du projet
      },
      {
        name: "AI Blog / RAG",
        description: "TODO — one sentence describing the product.",
        type: "AI",
        startYear: null as number | null,
        endYear: null as number | null,
        ongoing: false,
        tools: ["Next.js", "Claude"],
        image: null as string | null,
        logo: null as string | null,
        url: null as string | null,
      },
      {
        name: "Manifeste",
        description: "TODO — one sentence describing the product.",
        type: "Web",
        startYear: null as number | null,
        endYear: null as number | null,
        ongoing: false,
        tools: ["Next.js", "TypeScript"],
        image: null as string | null,
        logo: null as string | null,
        url: null as string | null,
      },
    ],
  },

  // Grille des contributions (src/components/sections/github.tsx)
  github: {
    title: "Contributions",
    username: "MaelDvllrs",
  },

  about: {
    title: "Developer, builder, entrepreneur.",
    subtitle: "Building products, end to end.", // TODO : à ajuster
    paragraphs: [
      "I'm Maël, a French fullstack developer and co-founder of Wenoble.",
      "I design and build web products, from the first idea to production.",
      "My focus sits at the intersection of product, engineering and AI.",
    ],
    // TODO : chiffres à vérifier / justifier
    stats: [
      { value: "4+", label: "Years of web development" },
      { value: "50+", label: "Projects / clients" },
      { value: "3", label: "Products built" },
      { value: "∞", label: "Things still to build" },
    ],
  },

  stack: {
    title: "Tools I like to build with.",
    // `name` doit correspondre à un logo de src/components/sections/stack.tsx
    // TODO : relire les descriptions
    tools: [
      { name: "React", description: "My go-to UI library. Component-driven interfaces, from dashboards to marketing sites." },
      { name: "Next.js", description: "The framework behind most of my products: routing, server rendering and APIs in one place." },
      { name: "TypeScript", description: "Types everywhere, front to back. Fewer bugs, safer refactors, faster onboarding." },
      { name: "Tailwind CSS", description: "Utility-first styling to design directly in the code and keep UIs consistent." },
      { name: "Webflow", description: "Visual development for marketing sites that teams can edit themselves, without a developer." },
      { name: "Node.js", description: "JavaScript on the server for APIs, workers, scripts and integrations." },
      { name: "Express", description: "Minimal Node.js server for lightweight APIs, webhooks and quick prototypes." },
      { name: "NestJS", description: "Structured backends for larger APIs: modules, dependency injection, clean architecture." },
      { name: "PostgreSQL", description: "The database I trust: relational, reliable, and powerful with JSONB and extensions." },
      { name: "MongoDB", description: "Document database when the data is flexible, nested or changes shape often." },
      { name: "Supabase", description: "Postgres with auth, storage and realtime built in. Perfect to ship an MVP fast." },
      { name: "Claude", description: "My main LLM for agents, RAG pipelines and AI features shipped to production." },
      { name: "OpenAI", description: "GPT models and embeddings for generation, classification and semantic search." },
      { name: "MCP", description: "Model Context Protocol: connecting LLMs to real tools, APIs and data sources." },
      { name: "Vercel", description: "Zero-config deployments, preview URLs on every branch, edge network by default." },
      { name: "Cloudflare", description: "DNS, CDN, security and edge workers in front of everything I put online." },
      { name: "Docker", description: "Reproducible environments, from local development to production containers." },
      { name: "GitHub", description: "Repositories, pull requests, Actions for CI/CD and issues to run the project." },
    ],
  },

  contact: {
    title: "Let's build it.",
    cta: "Get in touch",
  },
};
