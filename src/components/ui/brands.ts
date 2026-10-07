import {
  siClaude,
  siCloudflare,
  siDocker,
  siExpress,
  siGithub,
  siModelcontextprotocol,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWebflow,
} from "simple-icons";
import { OPENAI_PATH } from "@/components/ui/ai-logos";

// Outils : section Tools de l'accueil et technos des projets (page /work).
// Logo (tracé SVG 24×24), couleur de marque et couleur du texte posé dessus.
// Logos : simple-icons (CC0), sauf OpenAI (lobe-icons, MIT — absent de simple-icons).
const DARK = "#0a0a0a";
const LIGHT = "#ffffff";
export const BRANDS: Record<string, { path: string; color: string; text: string }> = {
  React: { path: siReact.path, color: `#${siReact.hex}`, text: DARK },
  "Next.js": { path: siNextdotjs.path, color: "#000000", text: LIGHT },
  TypeScript: { path: siTypescript.path, color: `#${siTypescript.hex}`, text: LIGHT },
  "Tailwind CSS": { path: siTailwindcss.path, color: `#${siTailwindcss.hex}`, text: DARK },
  Webflow: { path: siWebflow.path, color: `#${siWebflow.hex}`, text: LIGHT },
  "Node.js": { path: siNodedotjs.path, color: `#${siNodedotjs.hex}`, text: LIGHT },
  Express: { path: siExpress.path, color: "#000000", text: LIGHT },
  NestJS: { path: siNestjs.path, color: `#${siNestjs.hex}`, text: LIGHT },
  PostgreSQL: { path: siPostgresql.path, color: `#${siPostgresql.hex}`, text: LIGHT },
  MongoDB: { path: siMongodb.path, color: `#${siMongodb.hex}`, text: LIGHT },
  Supabase: { path: siSupabase.path, color: `#${siSupabase.hex}`, text: DARK },
  Claude: { path: siClaude.path, color: `#${siClaude.hex}`, text: LIGHT },
  OpenAI: { path: OPENAI_PATH, color: "#000000", text: LIGHT },
  MCP: { path: siModelcontextprotocol.path, color: "#000000", text: LIGHT },
  Vercel: { path: siVercel.path, color: "#000000", text: LIGHT },
  Cloudflare: { path: siCloudflare.path, color: `#${siCloudflare.hex}`, text: DARK },
  Docker: { path: siDocker.path, color: `#${siDocker.hex}`, text: LIGHT },
  GitHub: { path: siGithub.path, color: `#${siGithub.hex}`, text: LIGHT },
};
