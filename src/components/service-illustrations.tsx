import {
  AgentVisual,
  ChatbotVisual,
  ContentVisual,
  FeaturesVisual,
  RagVisual,
  SaasDashboardVisual,
  SaasInternalVisual,
  SaasMvpVisual,
  SaasPlatformVisual,
  SaasPortalVisual,
  WebBusinessVisual,
  WebLandingVisual,
  WebMarketingVisual,
  WebPortfolioVisual,
  WebWebflowVisual,
} from "@/components/build-visuals";

// Illustrations minimalistes des services, façon skeleton : de simples blocs arrondis aux
// couleurs du thème (clair / sombre). Le CMS choisit l'illustration via le champ `illustration`
// de la collection `services` : chaque valeur de ce select correspond à une clé de ILLUSTRATIONS.

function Block({ className = "" }: { className?: string }) {
  return <div className={`rounded-sm bg-foreground/10 ${className}`} />;
}

// Site web / landing page : une fenêtre de navigateur avec nav, hero + bouton, puis 3 cartes
function Website() {
  return (
    <div className="flex size-full items-center justify-center p-6">
      <div className="flex size-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-background transition-transform duration-500 ease-out group-hover:-translate-y-1">
        {/* barre du navigateur */}
        <div className="flex items-center gap-1 border-b border-border px-2.5 py-2">
          <span className="size-1.5 rounded-full bg-foreground/15" />
          <span className="size-1.5 rounded-full bg-foreground/15" />
          <span className="size-1.5 rounded-full bg-foreground/15" />
          <Block className="ml-2 h-1.5 w-1/3" />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          {/* nav */}
          <div className="flex items-center justify-between">
            <Block className="h-1.5 w-6" />
            <div className="flex gap-1.5">
              <Block className="h-1.5 w-4" />
              <Block className="h-1.5 w-4" />
              <Block className="h-1.5 w-4" />
            </div>
          </div>

          {/* hero */}
          <div className="mt-2 flex flex-col items-center gap-1.5">
            <Block className="h-2.5 w-3/5" />
            <Block className="h-1.5 w-2/5" />
            <div className="mt-1 h-2.5 w-12 rounded-sm bg-foreground/25" />
          </div>

          {/* sections */}
          <div className="mt-auto grid grid-cols-3 gap-1.5">
            <Block className="h-6" />
            <Block className="h-6" />
            <Block className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Hauteurs des barres du graphique (en %), fixes pour un rendu identique côté serveur et client
const CHART_BARS = [40, 65, 50, 80, 60, 95, 75];

// SaaS / dashboard : une fenêtre d'app avec sidebar, 3 KPI puis un graphique en barres
function Saas() {
  return (
    <div className="flex size-full items-center justify-center p-6">
      <div className="flex size-full max-w-80 overflow-hidden rounded-md border border-border bg-background transition-transform duration-500 ease-out group-hover:-translate-y-1">
        {/* sidebar : logo puis entrées de menu, la première active */}
        <div className="flex w-1/5 flex-col gap-1.5 border-r border-border p-2">
          <Block className="mb-1 size-2.5 rounded-full" />
          <div className="h-1.5 w-full rounded-sm bg-foreground/25" />
          <Block className="h-1.5 w-4/5" />
          <Block className="h-1.5 w-full" />
          <Block className="h-1.5 w-3/5" />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          {/* en-tête : titre + avatar */}
          <div className="flex items-center justify-between">
            <Block className="h-2 w-1/3" />
            <Block className="size-2.5 rounded-full" />
          </div>

          {/* KPI */}
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1 rounded-sm border border-border p-1.5">
                <Block className="h-1 w-3/5" />
                <div className="h-2 w-4/5 rounded-sm bg-foreground/20" />
              </div>
            ))}
          </div>

          {/* graphique */}
          <div className="flex flex-1 items-end gap-1 rounded-sm border border-border p-1.5">
            {CHART_BARS.map((height, i) => (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className={`flex-1 rounded-[2px] ${i === CHART_BARS.length - 2 ? "bg-foreground/25" : "bg-foreground/10"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Étoile à 4 branches : le symbole « IA » des réponses générées
function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

// Outil IA (chatbot, génération de contenu) : une conversation avec un prompt, une réponse
// générée sur plusieurs lignes, puis le champ de saisie avec son bouton d'envoi
function Ai() {
  return (
    <div className="flex size-full items-center justify-center p-6">
      <div className="flex size-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-background transition-transform duration-500 ease-out group-hover:-translate-y-1">
        {/* en-tête : assistant */}
        <div className="flex items-center gap-1.5 border-b border-border px-2.5 py-2">
          <Sparkle className="size-2.5 text-foreground/30" />
          <Block className="h-1.5 w-1/4" />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          {/* message de l'utilisateur */}
          <div className="ml-auto h-3 w-2/5 rounded-md rounded-br-[2px] bg-foreground/20" />

          {/* réponse générée */}
          <div className="flex gap-1.5">
            <Sparkle className="mt-0.5 size-2.5 shrink-0 text-foreground/30" />
            <div className="flex flex-1 flex-col gap-1">
              <Block className="h-1.5 w-full" />
              <Block className="h-1.5 w-11/12" />
              <Block className="h-1.5 w-4/5" />
              <Block className="h-1.5 w-2/5" />
            </div>
          </div>

          {/* champ de saisie */}
          <div className="mt-auto flex items-center gap-1.5 rounded-md border border-border p-1">
            <Block className="ml-1 h-1.5 flex-1" />
            <div className="size-3 rounded-sm bg-foreground/25" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const ILLUSTRATIONS = {
  website: Website,
  saas: Saas,
  ai: Ai,
  // visuels réalistes de « What can I build » (build-visuals.tsx)
  "ai-chatbot": ChatbotVisual,
  "ai-content": ContentVisual,
  "ai-rag": RagVisual,
  "ai-agent": AgentVisual,
  "ai-features": FeaturesVisual,
  "saas-platform": SaasPlatformVisual,
  "saas-dashboard": SaasDashboardVisual,
  "saas-internal": SaasInternalVisual,
  "saas-portal": SaasPortalVisual,
  "saas-mvp": SaasMvpVisual,
  "web-business": WebBusinessVisual,
  "web-landing": WebLandingVisual,
  "web-marketing": WebMarketingVisual,
  "web-portfolio": WebPortfolioVisual,
  "web-webflow": WebWebflowVisual,
} as const;

export type IllustrationKey = keyof typeof ILLUSTRATIONS;

export function ServiceIllustration({ name }: { name: IllustrationKey }) {
  const Illustration = ILLUSTRATIONS[name];
  return (
    <div aria-hidden className="size-full">
      <Illustration />
    </div>
  );
}
