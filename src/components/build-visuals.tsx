// Visuels de la section « What can I build » du service IA : des fragments d'interface réalistes
// (vrais textes, icônes), sans fond, aux couleurs du thème (clair / sombre). Le bas s'estompe
// dans la page. Chaque visuel remplit sa zone (4/3) ; les clés sont enregistrées dans
// ILLUSTRATIONS (service-illustrations.tsx) et choisies dans le CMS.

const SHADOW = "shadow-[0_12px_32px_-16px_rgba(0,0,0,0.45)]";

// Zone du visuel : contenu centré verticalement, bas estompé dans la page (`mask` : dégradé
// du masque, à surcharger)
function Fade({
  className = "",
  mask = "[mask-image:linear-gradient(to_bottom,black_75%,transparent)]",
  children,
}: {
  className?: string;
  mask?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex size-full flex-col justify-center overflow-hidden text-[11px] leading-snug ${mask} ${className}`}
    >
      {children}
    </div>
  );
}

// Icônes (tracés Lucide)
function Icon({ className = "size-3.5", children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const CheckIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);
const ChevronIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
);
const SendIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </Icon>
);
const SearchIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);
const FileIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M16 13H8M16 17H8M10 9H8" />
  </Icon>
);
const MailIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </Icon>
);
const CalendarIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Icon>
);
const DatabaseIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14a9 3 0 0 0 18 0V5" />
    <path d="M3 12a9 3 0 0 0 18 0" />
  </Icon>
);
const GlobeIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </Icon>
);
const RefreshIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </Icon>
);
const TagIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </Icon>
);
const ListIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="M3 6h.01M3 12h.01M3 18h.01M8 6h13M8 12h13M8 18h13" />
  </Icon>
);
// Étoile « IA » (pleine)
const SparkleIcon = ({ className = "size-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`} aria-hidden>
    <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
  </svg>
);
const Spinner = ({ className = "size-3" }: { className?: string }) => (
  <span
    className={`inline-block shrink-0 animate-spin rounded-full border-[1.5px] border-foreground/15 border-t-foreground ${className}`}
  />
);

// --- 1. Chatbot -----------------------------------------------------------------------------

// Un assistant de support : question du client, réponse, outils appelés, puis le champ de saisie
export function ChatbotVisual() {
  return (
    <Fade className="gap-3 p-1">
      <p className="ml-auto max-w-[75%] rounded-2xl bg-surface px-3 py-1.5">Can I change my delivery address?</p>

      <div className="flex gap-2">
        <span className="mt-0.5 flex size-5 items-center justify-center rounded-full border border-border">
          <SparkleIcon className="size-2.5" />
        </span>
        <div className="flex flex-col gap-2">
          <p>Your order #4821 hasn&apos;t shipped yet, so yes. I&apos;ll update it for you.</p>
          <p className="flex items-center gap-1 text-muted">
            Worked with 2 tools <ChevronIcon className="size-3" />
          </p>
          <div className={`flex flex-col gap-1.5 rounded-lg border border-border bg-background p-2.5 ${SHADOW}`}>
            <p className="flex items-center gap-2">
              <CheckIcon className="size-3 text-muted" /> Order #4821 found
            </p>
            <p className="flex items-center gap-2">
              <Spinner /> Updating shipping address…
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-background py-1.5 pr-1.5 pl-3">
        <span className="text-muted">Ask anything…</span>
        <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-background">
          <SendIcon className="size-3" />
        </span>
      </div>
    </Fade>
  );
}

// --- 2. Génération de contenu agentique ---------------------------------------------------------

const CONTENT_STEPS = [
  { title: "Research the topic", detail: "12 sources analysed", state: "done" },
  { title: "Build the outline", detail: "6 sections, 1 FAQ", state: "done" },
  { title: "Write the draft", detail: "Writing section 4 of 6…", state: "active" },
  { title: "SEO & brand review", detail: "Tone, keywords, links", state: "todo" },
] as const;

// Un agent qui écrit un article : ses étapes numérotées, faites, en cours et à venir
export function ContentVisual() {
  return (
    <Fade className="p-1">
      <div className={`flex flex-col gap-3 rounded-xl border border-border bg-background p-3.5 ${SHADOW}`}>
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium">How to choose a CRM in 2026</p>
          <span className="flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
            <Spinner className="size-2" /> Agent running
          </span>
        </div>

        <ol className="flex flex-col">
          {CONTENT_STEPS.map((step, i) => (
            <li key={step.title} className={`flex gap-3 ${step.state === "todo" ? "opacity-45" : ""}`}>
              {/* numéro, relié au suivant par une ligne */}
              <div className="flex flex-col items-center">
                <span
                  className={`flex size-5 items-center justify-center rounded-full border text-[10px] ${
                    step.state === "active" ? "border-foreground" : "border-border text-muted"
                  }`}
                >
                  {step.state === "done" ? <CheckIcon className="size-2.5" /> : i + 1}
                </span>
                {i < CONTENT_STEPS.length - 1 && <span className="w-px flex-1 bg-border" />}
              </div>
              <div className="pb-3">
                <p className="font-medium">{step.title}</p>
                <p className="text-muted">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Fade>
  );
}

// --- 3. Système RAG ----------------------------------------------------------------------------

const RAG_SOURCES = [
  { name: "refund-policy.pdf", where: "p. 3", score: "0.94" },
  { name: "billing-faq.md", where: "§ Annual plans", score: "0.88" },
  { name: "terms-of-service.pdf", where: "p. 12", score: "0.81" },
];

// Recherche dans les documents de l'entreprise : la question, les passages retrouvés (avec leur
// score de pertinence), puis la réponse sourcée
export function RagVisual() {
  return (
    <Fade className="gap-2 p-1">
      <div className="flex items-center gap-2 rounded-lg border border-foreground/40 bg-background px-3 py-2 ring-4 ring-foreground/5">
        <SearchIcon className="size-3.5 text-muted" />
        <span className="font-medium">Can annual plans be refunded?</span>
      </div>

      <ul className={`flex flex-col rounded-lg border border-border bg-background p-1 ${SHADOW}`}>
        {RAG_SOURCES.map((source, i) => (
          <li
            key={source.name}
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 0 ? "bg-surface" : ""}`}
          >
            <FileIcon className="size-3 text-muted" />
            <span className="font-medium">{source.name}</span>
            <span className="truncate text-muted">{source.where}</span>
            <span className="ml-auto font-mono text-[10px] text-muted">{source.score}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 px-1 pt-1">
        <SparkleIcon className="mt-0.5 size-3" />
        <p>
          Yes, within 30 days of purchase, prorated after the first month.{" "}
          <span className="rounded border border-border px-1 font-mono text-[9px] text-muted">1</span>{" "}
          <span className="rounded border border-border px-1 font-mono text-[9px] text-muted">2</span>
        </p>
      </div>
    </Fade>
  );
}

// --- 4. Agent IA -----------------------------------------------------------------------------

// Demi-globe en fil de fer sur lequel l'agent relie ses outils. Coordonnées du dessin : 400 de
// large, globe centré en x, équateur en bas (y = 290). Le cadrage (viewBox) ne garde que la
// bande y 100 → 320 autour du dôme, pour qu'il soit centré verticalement dans la zone.
const R = 170;
const CX = 200;
const CY = 290;
const VIEW_Y = 100;
const VIEW_H = 220;
const MERIDIANS = [0.3, 0.6, 0.85];
const PARALLELS = [165, 215, 260];

// position (en % du cadrage) d'un point : `k` = position du méridien (-1 → 1), `y` = hauteur
function at(k: number, y: number) {
  const x = CX + k * Math.sqrt(Math.max(0, R * R - (CY - y) ** 2));
  return { left: `${(x / 400) * 100}%`, top: `${((y - VIEW_Y) / VIEW_H) * 100}%` };
}

const AGENT_TOOLS = [
  { Icon: MailIcon, k: -0.6, y: 165, active: true },
  { Icon: CalendarIcon, k: 0.3, y: 165, active: false },
  { Icon: DatabaseIcon, k: -0.3, y: 215, active: false },
  { Icon: GlobeIcon, k: 0.85, y: 215, active: false },
  { Icon: FileIcon, k: -0.85, y: 260, active: false },
];

// Un agent autonome et les outils qu'il utilise (mails, agenda, base de données, web, documents)
export function AgentVisual() {
  return (
    <Fade mask="">
      {/* bloc au ratio du cadrage (400 × 220), centré dans la zone : le dessin et les pastilles
          positionnées en % restent alignés quelle que soit la hauteur de la zone */}
      <div className="relative aspect-[400/220] w-full [mask-image:linear-gradient(to_bottom,black_65%,transparent)]">
        <svg
          viewBox={`0 ${VIEW_Y} 400 ${VIEW_H}`}
          className="absolute inset-0 size-full text-border"
          fill="none"
          aria-hidden
        >
          <path d={`M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`} stroke="currentColor" />
          <path d={`M${CX} ${CY - R}V${CY}`} stroke="currentColor" />
          {MERIDIANS.map((k) => (
            <path key={k} d={`M${CX - k * R} ${CY} A${k * R} ${R} 0 0 1 ${CX + k * R} ${CY}`} stroke="currentColor" />
          ))}
          {PARALLELS.map((y) => {
            const w = Math.sqrt(R * R - (CY - y) ** 2);
            return <path key={y} d={`M${CX - w} ${y}H${CX + w}`} stroke="currentColor" />;
          })}
        </svg>

        {AGENT_TOOLS.map(({ Icon: ToolIcon, k, y, active }) => (
          <span
            key={`${k}-${y}`}
            style={at(k, y)}
            className={`absolute flex size-7 -translate-1/2 items-center justify-center rounded-full border bg-background ${
              active ? "border-foreground/50 text-foreground ring-4 ring-foreground/5" : "border-border text-muted"
            }`}
          >
            <ToolIcon className="size-3" />
          </span>
        ))}

        {/* l'agent : en cours d'exécution, au centre du dôme */}
        <div
          style={at(0, 240)}
          className={`absolute flex -translate-1/2 items-center rounded-lg border border-border bg-background ${SHADOW}`}
        >
          <span className="flex items-center gap-1.5 px-2.5 py-1.5 font-mono">
            <span className="size-1.5 animate-pulse rounded-full bg-foreground" />
            sending recap
          </span>
          <span className="border-l border-border px-2 py-1.5 text-muted">
            <RefreshIcon className="size-3" />
          </span>
        </div>
      </div>
    </Fade>
  );
}

// --- 5. Features IA sur mesure -----------------------------------------------------------------

const TICKETS = [
  { title: "Refund not received", tag: "Billing", time: "2m" },
  { title: "Login loop on iOS app", tag: "Bug", time: "18m" },
  { title: "Upgrade to team plan", tag: "Sales", time: "1h" },
  { title: "Export data to CSV", tag: "Feature", time: "3h" },
  { title: "Invoice address wrong", tag: "Billing", time: "5h" },
];

// L'IA intégrée dans un outil métier : une boîte de tickets, avec par-dessus les actions IA
// (résumé, tag automatique, brouillon de réponse)
export function FeaturesVisual() {
  return (
    <Fade className="p-1">
      <div className={`relative rounded-xl border border-border bg-background ${SHADOW}`}>
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="font-medium">Inbox</p>
          <span className="text-muted">24 open</span>
        </div>
        <ul>
          {TICKETS.map((ticket) => (
            <li key={ticket.title} className="flex items-center gap-2 px-3 py-1.5">
              <span className="font-medium">{ticket.title}</span>
              <span className="ml-auto rounded-full border border-border px-1.5 text-[10px] text-muted">
                {ticket.tag}
              </span>
              <span className="w-5 text-right text-muted">{ticket.time}</span>
            </li>
          ))}
        </ul>

        {/* actions IA flottantes, placées par rapport à la boîte de tickets */}
        <span
          className={`absolute top-[22%] left-[22%] flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 ${SHADOW}`}
        >
          <SparkleIcon className="size-3" /> Summarize this thread
        </span>
        <span
          className={`absolute top-[50%] -right-1 flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 ${SHADOW}`}
        >
          <TagIcon className="size-3" /> Auto-tagged as Billing
        </span>
        <span
          className={`absolute top-[78%] left-[8%] flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 ${SHADOW}`}
        >
          <ListIcon className="size-3" /> Draft a reply in your tone
        </span>
      </div>
    </Fade>
  );
}

// === Service SaaS ===========================================================================

const CardIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20" />
  </Icon>
);
const TrendIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
    <path d="M16 7h6v6" />
  </Icon>
);
const DownloadIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5" />
    <path d="M12 15V3" />
  </Icon>
);
const MessageIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Icon>
);
const RocketIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </Icon>
);

// Initiales dans un rond (avatar)
function Avatar({ initials }: { initials: string }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface text-[9px] font-medium text-muted">
      {initials}
    </span>
  );
}

// Carte flottante (notification, action) posée par-dessus un écran
function Toast({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={`absolute flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 whitespace-nowrap ${SHADOW} ${className}`}
    >
      {children}
    </span>
  );
}

// --- 1. Plateforme SaaS --------------------------------------------------------------------------

const MEMBERS = [
  { initials: "SM", email: "sarah@acme.co", role: "Owner" },
  { initials: "TL", email: "tom@acme.co", role: "Admin" },
  { initials: "JD", email: "julia@acme.co", role: "Member" },
];

// Réglages d'un espace client : abonnement en cours, places utilisées, membres et leurs rôles,
// et la notification du paiement
export function SaasPlatformVisual() {
  return (
    <Fade className="p-1">
      <div className={`relative flex flex-col gap-3 rounded-xl border border-border bg-background p-3.5 ${SHADOW}`}>
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-[10px] font-semibold text-background">
            A
          </span>
          <div>
            <p className="font-medium">Acme Inc.</p>
            <p className="text-[10px] text-muted">Workspace settings</p>
          </div>
          <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[10px]">Pro · $49/mo</span>
        </div>

        {/* places utilisées */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-muted">
            <span>Seats</span>
            <span>8 of 10</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-surface">
            <div className="h-full w-4/5 rounded-full bg-foreground" />
          </div>
        </div>

        <ul className="flex flex-col gap-2 border-t border-border pt-3">
          {MEMBERS.map((m) => (
            <li key={m.email} className="flex items-center gap-2">
              <Avatar initials={m.initials} />
              <span>{m.email}</span>
              <span className="ml-auto text-muted">{m.role}</span>
            </li>
          ))}
        </ul>

        <Toast className="-right-1 -bottom-4">
          <CardIcon className="size-3 text-muted" /> Payment succeeded
          <CheckIcon className="size-3" />
        </Toast>
      </div>
    </Fade>
  );
}

// --- 2. Dashboard sur mesure ---------------------------------------------------------------------

const KPIS = [
  { label: "Revenue", value: "€48.2k", trend: "+12%" },
  { label: "Orders", value: "1,284", trend: "+8%" },
  { label: "Conversion", value: "3.4%", trend: "+0.6" },
];
// séries du graphique (0 → 100, du haut vers le bas)
const REVENUE = [62, 48, 55, 38, 44, 30, 36, 22, 28, 15];
const LAST_YEAR = [72, 70, 66, 68, 60, 62, 58, 55, 57, 50];
const toPoints = (serie: number[]) => serie.map((v, i) => `${(i / (serie.length - 1)) * 300},${v}`).join(" ");
// point survolé (infobulle) : 7e point de la courbe
const HOVER = 6;

// Un tableau de bord : indicateurs clés (le premier sélectionné), courbe comparée à l'an passé,
// infobulle sur un point
export function SaasDashboardVisual() {
  return (
    <Fade className="p-1">
      <div className={`rounded-xl border border-border bg-background ${SHADOW}`}>
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          {KPIS.map((kpi, i) => (
            <div key={kpi.label} className="relative flex flex-col gap-0.5 px-3 py-2.5">
              <span className="text-[10px] text-muted">{kpi.label}</span>
              <span className={`text-base font-semibold tracking-tight ${i ? "text-muted" : ""}`}>{kpi.value}</span>
              <span className="flex items-center gap-1 text-[10px] text-muted">
                <TrendIcon className="size-2.5" /> {kpi.trend}
              </span>
              {/* onglet sélectionné */}
              {i === 0 && <span className="absolute inset-x-0 -bottom-px h-px bg-foreground" />}
            </div>
          ))}
        </div>

        <div className="px-3 pt-4 pb-3">
          {/* graphique + point survolé, dans le même repère (pourcentages de la zone du tracé) */}
          <div className="relative h-24">
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="size-full" fill="none" aria-hidden>
              {[1, 33, 66, 99].map((y) => (
                <path key={y} d={`M0 ${y}H300`} className="stroke-border" vectorEffect="non-scaling-stroke" />
              ))}
              <polyline
                points={toPoints(LAST_YEAR)}
                className="stroke-muted"
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                points={toPoints(REVENUE)}
                className="stroke-foreground"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span
              style={{ left: `${(HOVER / (REVENUE.length - 1)) * 100}%`, top: `${REVENUE[HOVER]}%` }}
              className="absolute size-2 -translate-1/2 rounded-full border-2 border-background bg-foreground"
            />
            <Toast className="-top-3 left-[48%] py-1">
              <span className="text-muted">Jul 14</span> <span className="font-medium">€5,420</span>
            </Toast>
          </div>
          <div className="mt-1.5 flex justify-between text-[9px] text-muted">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
          </div>
        </div>
      </div>
    </Fade>
  );
}

// --- 3. Outil interne ----------------------------------------------------------------------------

const REQUESTS = [
  { who: "Marc D.", item: "MacBook Pro 14″", amount: "€2,399", status: "Pending", selected: true },
  { who: "Lina K.", item: "Figma licences ×5", amount: "€675", status: "Pending", selected: true },
  { who: "Hugo R.", item: "Trade show booth", amount: "€4,800", status: "Approved", selected: false },
  { who: "Emma P.", item: "Team offsite", amount: "€1,950", status: "Pending", selected: true },
];

// Un outil de validation des demandes d'achat : tableau avec sélection, et barre d'actions groupées
export function SaasInternalVisual() {
  return (
    <Fade className="p-1 pb-6">
      <div className={`relative rounded-xl border border-border bg-background ${SHADOW}`}>
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="font-medium">Purchase requests</p>
          <span className="text-muted">This week</span>
        </div>
        <ul>
          {REQUESTS.map((r) => (
            <li
              key={r.item}
              className={`flex items-center gap-2 border-b border-border px-3 py-1.5 last:border-b-0 ${
                r.selected ? "bg-surface/60" : ""
              }`}
            >
              {/* case à cocher */}
              <span
                className={`flex size-3 shrink-0 items-center justify-center rounded-[3px] border ${
                  r.selected ? "border-foreground bg-foreground text-background" : "border-border"
                }`}
              >
                {r.selected && <CheckIcon className="size-2" />}
              </span>
              <span className="w-11 shrink-0 truncate text-muted">{r.who}</span>
              <span className="truncate font-medium">{r.item}</span>
              <span className="ml-auto">{r.amount}</span>
              <span
                className={`w-14 shrink-0 rounded-full border px-1.5 text-center text-[10px] ${
                  r.status === "Approved" ? "border-foreground/40" : "border-border text-muted"
                }`}
              >
                {r.status}
              </span>
            </li>
          ))}
        </ul>

        {/* barre d'actions groupées */}
        <div
          className={`absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-border bg-background py-1 pr-1 pl-3 whitespace-nowrap ${SHADOW}`}
        >
          <span className="text-muted">3 selected</span>
          <span className="text-muted">Export</span>
          <span className="rounded-md bg-foreground px-2 py-1 font-medium text-background">Approve all</span>
        </div>
      </div>
    </Fade>
  );
}

// --- 4. Portail client ---------------------------------------------------------------------------

const MILESTONES = [
  { label: "Design approved", state: "done" },
  { label: "Development", state: "active" },
  { label: "Launch", state: "todo" },
] as const;

// L'espace d'un client : avancement de son projet, étapes, dernier document, et un message de l'équipe
export function SaasPortalVisual() {
  return (
    <Fade className="p-1 pt-5">
      <div className={`relative flex flex-col gap-3 rounded-xl border border-border bg-background p-3.5 ${SHADOW}`}>
        <div className="flex items-center gap-2">
          <Avatar initials="SM" />
          <p>
            Welcome back, <span className="font-medium">Sarah</span>
          </p>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-border p-2.5">
          <div className="flex justify-between">
            <span className="font-medium">Website redesign</span>
            <span className="text-muted">72%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-surface">
            <div className="h-full w-[72%] rounded-full bg-foreground" />
          </div>
          <ul className="mt-1 flex flex-col gap-1">
            {MILESTONES.map((m) => (
              <li key={m.label} className={`flex items-center gap-2 ${m.state === "todo" ? "text-muted" : ""}`}>
                {m.state === "done" && <CheckIcon className="size-3 text-muted" />}
                {m.state === "active" && <Spinner className="size-2.5" />}
                {m.state === "todo" && <span className="size-2.5 rounded-full border border-border" />}
                {m.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <FileIcon className="size-3 text-muted" />
          <span>Invoice-2026-014.pdf</span>
          <span className="ml-auto flex items-center gap-1 text-muted">
            <DownloadIcon className="size-3" /> Download
          </span>
        </div>

        <Toast className="-top-4 -right-1">
          <MessageIcon className="size-3 text-muted" /> New message from your team
        </Toast>
      </div>
    </Fade>
  );
}

// --- 5. MVP & nouveaux produits ------------------------------------------------------------------

const ROADMAP = [
  { week: "Week 1", label: "Scope & user flows", state: "done" },
  { week: "Week 2–5", label: "Build the core features", state: "done" },
  { week: "Week 6", label: "Launch the MVP", state: "active" },
  { week: "Next", label: "Iterate on feedback", state: "todo" },
] as const;

// Du concept au produit : la feuille de route du MVP, la mise en ligne et les premiers inscrits
export function SaasMvpVisual() {
  return (
    <Fade className="p-1">
      <div className={`flex flex-col gap-3 rounded-xl border border-border bg-background p-3.5 ${SHADOW}`}>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 font-medium">
            <RocketIcon className="size-3.5" /> From idea to MVP
          </p>
          <span className="text-muted">6 weeks</span>
        </div>

        <ol className="flex flex-col gap-2">
          {ROADMAP.map((step) => (
            <li key={step.label} className={`flex items-center gap-2.5 ${step.state === "todo" ? "opacity-45" : ""}`}>
              <span
                className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                  step.state === "active" ? "border-foreground" : "border-border text-muted"
                }`}
              >
                {step.state === "done" && <CheckIcon className="size-2.5" />}
                {step.state === "active" && <span className="size-1.5 animate-pulse rounded-full bg-foreground" />}
              </span>
              <span className="w-14 shrink-0 text-muted">{step.week}</span>
              <span className={step.state === "active" ? "font-medium" : ""}>{step.label}</span>
            </li>
          ))}
        </ol>

        {/* mise en ligne + premiers inscrits */}
        <div className="flex items-center gap-2 border-t border-border pt-3">
          <span className="flex items-center rounded-md border border-border font-mono">
            <span className="px-2 py-1">app.yourproduct.com</span>
            <span className="border-l border-border px-2 py-1 text-muted">live</span>
          </span>
          <span className="ml-auto flex items-center gap-1">
            <TrendIcon className="size-3 text-muted" /> <span className="font-medium">127</span>
            <span className="text-muted">sign-ups</span>
          </span>
        </div>
      </div>
    </Fade>
  );
}

// === Service Site web =======================================================================

const StarIcon = ({ className = "size-2.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className}`} aria-hidden>
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
  </svg>
);
const ArrowRightIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </Icon>
);
const LayersIcon = (p: { className?: string }) => (
  <Icon {...p}>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </Icon>
);

// Fenêtre de navigateur : barre avec les 3 points et l'adresse du site
function Browser({ url, className = "", children }: { url: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative rounded-xl border border-border bg-background ${SHADOW} ${className}`}>
      <div className="flex items-center gap-1 border-b border-border px-3 py-2">
        <span className="size-1.5 rounded-full bg-foreground/15" />
        <span className="size-1.5 rounded-full bg-foreground/15" />
        <span className="size-1.5 rounded-full bg-foreground/15" />
        <span className="mx-auto rounded-md bg-surface px-3 py-0.5 text-[10px] text-muted">{url}</span>
      </div>
      {children}
    </div>
  );
}

// --- 1. Site vitrine -----------------------------------------------------------------------------

// Le site d'une entreprise : navigation, accroche, appels à l'action, preuve sociale, et une
// demande de devis qui arrive
export function WebBusinessVisual() {
  return (
    <Fade className="p-1">
      <Browser url="northwind-studio.com">
        <div className="flex flex-col gap-3 p-3.5">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-tight">Northwind</span>
            <span className="ml-auto text-muted">Services</span>
            <span className="text-muted">About</span>
            <span className="rounded-md bg-foreground px-2 py-0.5 text-background">Contact</span>
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <p className="text-lg leading-tight font-semibold tracking-tight">Architecture that lasts.</p>
            <p className="max-w-[80%] text-muted">Homes and workspaces designed around the way you live.</p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-md bg-foreground px-2.5 py-1 text-background">Book a call</span>
            <span className="rounded-md border border-border px-2.5 py-1">Our projects</span>
          </div>

          <div className="flex items-center gap-2 border-t border-border pt-2.5 text-muted">
            <span className="flex text-foreground">
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} />
              ))}
            </span>
            <span>
              <span className="font-medium text-foreground">4.9</span> from 200+ clients
            </span>
          </div>
        </div>

        <Toast className="-right-1 -bottom-4">
          <MailIcon className="size-3 text-muted" /> New quote request
        </Toast>
      </Browser>
    </Fade>
  );
}

// --- 2. Landing page ----------------------------------------------------------------------------

// Une page centrée sur une offre : accroche, bénéfices, inscription, et le taux de conversion
export function WebLandingVisual() {
  return (
    <Fade className="p-1">
      <Browser url="launchkit.io/early-access">
        <div className="flex flex-col items-center gap-2.5 px-4 pt-5 pb-4 text-center">
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">
            Early access · 50% off
          </span>
          <p className="text-lg leading-tight font-semibold tracking-tight">Launch your course in 7 days</p>
          <ul className="flex gap-3 text-muted">
            <li className="flex items-center gap-1">
              <CheckIcon className="size-3" /> No code
            </li>
            <li className="flex items-center gap-1">
              <CheckIcon className="size-3" /> Payments built in
            </li>
          </ul>
          <div className="mt-1 flex w-full max-w-60 items-center rounded-lg border border-border p-1 pl-2.5">
            <span className="text-muted">you@company.com</span>
            <span className="ml-auto flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-background">
              Get access <ArrowRightIcon className="size-2.5" />
            </span>
          </div>
        </div>

        <Toast className="-bottom-4 -left-1 flex-col !items-start gap-0">
          <span className="text-[10px] text-muted">Conversion rate</span>
          <span className="flex items-center gap-1.5">
            <span className="text-sm font-semibold">8.4%</span>
            <span className="flex items-center gap-0.5 text-muted">
              <TrendIcon className="size-2.5" /> +2.1
            </span>
          </span>
        </Toast>
      </Browser>
    </Fade>
  );
}

// --- 3. Site marketing --------------------------------------------------------------------------

const SCORES = [
  { label: "Performance", value: 98 },
  { label: "SEO", value: 100 },
  { label: "Accessibility", value: 96 },
];

// Le site vu par Google : un article en tête des résultats de recherche, et les scores du site
export function WebMarketingVisual() {
  return (
    <Fade className="gap-3 p-1">
      {/* résultat de recherche */}
      <div className={`flex flex-col gap-2 rounded-xl border border-border bg-background p-3.5 ${SHADOW}`}>
        <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
          <SearchIcon className="size-3 text-muted" />
          <span>best invoicing tool for freelancers</span>
        </div>
        <div className="flex flex-col gap-0.5 pt-1">
          <span className="flex items-center gap-1.5 text-[10px] text-muted">
            <span className="flex size-3.5 items-center justify-center rounded-full bg-foreground text-[7px] font-semibold text-background">
              P
            </span>
            paidly.com › blog
          </span>
          <span className="font-medium underline-offset-2">The 2026 guide to getting paid faster as a freelancer</span>
          <span className="text-muted">Templates, reminders and the tools that cut late payments by 40%…</span>
        </div>
      </div>

      {/* scores du site */}
      <div className="flex justify-center gap-6">
        {SCORES.map((score) => (
          <div key={score.label} className="flex flex-col items-center gap-1">
            <span className="relative flex size-10 items-center justify-center font-semibold">
              <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" fill="none" aria-hidden>
                <circle cx="18" cy="18" r="16" className="stroke-border" strokeWidth="2.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  className="stroke-foreground"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${(score.value / 100) * 100.5} 100.5`}
                />
              </svg>
              {score.value}
            </span>
            <span className="text-[10px] text-muted">{score.label}</span>
          </div>
        ))}
      </div>
    </Fade>
  );
}

// --- 4. Portfolio -------------------------------------------------------------------------------

const WORKS = [
  { name: "Lumen", kind: "Brand identity", shape: "rounded-full" },
  { name: "Orbit", kind: "Mobile app", shape: "rounded-md rotate-12" },
  { name: "Fieldnotes", kind: "Editorial", shape: "rounded-none" },
  { name: "Kiln", kind: "E-commerce", shape: "rounded-t-full" },
];

// Un portfolio : présentation, disponibilité, et une grille de projets
export function WebPortfolioVisual() {
  return (
    <Fade className="p-1">
      <Browser url="alexmartin.design">
        <div className="flex flex-col gap-3 p-3.5">
          <div className="flex items-center gap-2">
            <Avatar initials="AM" />
            <div>
              <p className="font-medium">Alex Martin</p>
              <p className="text-[10px] text-muted">Product designer, Lyon</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[10px]">
              <span className="size-1.5 animate-pulse rounded-full bg-foreground" /> Available for work
            </span>
          </div>

          <ul className="grid grid-cols-2 gap-2">
            {WORKS.map((work) => (
              <li key={work.name} className="flex flex-col gap-1">
                {/* vignette : une forme simple par projet */}
                <div className="flex aspect-[16/9] items-center justify-center rounded-md bg-surface">
                  <span className={`size-5 bg-foreground/20 ${work.shape}`} />
                </div>
                <p className="flex justify-between">
                  <span className="font-medium">{work.name}</span>
                  <span className="text-[10px] text-muted">{work.kind}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Browser>
    </Fade>
  );
}

// --- 5. Site Webflow ----------------------------------------------------------------------------

const NAVIGATOR = [
  { label: "Body", depth: 0 },
  { label: "Navbar", depth: 1, component: true },
  { label: "Hero section", depth: 1 },
  { label: "Heading", depth: 2, selected: true },
  { label: "Button", depth: 2, component: true },
  { label: "Blog grid", depth: 1, cms: true },
];

// L'éditeur Webflow : l'arbre des éléments (composants, collection CMS) et la page, avec
// l'élément sélectionné
export function WebWebflowVisual() {
  return (
    <Fade className="p-1">
      <div className={`flex overflow-hidden rounded-xl border border-border bg-background ${SHADOW}`}>
        {/* navigateur d'éléments */}
        <div className="flex w-[42%] flex-col gap-0.5 border-r border-border p-2">
          <p className="flex items-center gap-1.5 px-1 pb-1 text-[10px] text-muted">
            <LayersIcon className="size-3" /> Navigator
          </p>
          {NAVIGATOR.map((node) => (
            <p
              key={node.label}
              style={{ paddingLeft: `${node.depth * 10 + 4}px` }}
              className={`flex items-center gap-1.5 rounded py-0.5 pr-1 ${node.selected ? "bg-foreground text-background" : ""}`}
            >
              <span
                className={`size-2 rounded-[2px] border ${node.selected ? "border-background" : "border-foreground/30"}`}
              />
              {node.label}
              {node.component && <span className="ml-auto text-[9px] text-muted">◆</span>}
              {node.cms && <DatabaseIcon className="ml-auto size-2.5 text-muted" />}
            </p>
          ))}
        </div>

        {/* page en cours d'édition */}
        <div className="flex flex-1 flex-col gap-2 p-3">
          <div className="flex justify-between text-[10px] text-muted">
            <span>Logo</span>
            <span>Menu</span>
          </div>
          <div className="relative mt-2 rounded-[2px] outline outline-1 outline-offset-2 outline-foreground">
            <span className="absolute -top-4 -left-0.5 rounded-t-sm bg-foreground px-1 text-[9px] text-background">
              Heading
            </span>
            <p className="text-sm leading-tight font-semibold tracking-tight">Design that scales with you</p>
          </div>
          <span className="w-fit rounded-md bg-foreground px-2 py-0.5 text-background">Get started</span>
          <div className="mt-1 grid grid-cols-2 gap-1.5">
            <span className="aspect-[4/3] rounded-sm bg-surface" />
            <span className="aspect-[4/3] rounded-sm bg-surface" />
          </div>
          <span className="flex items-center gap-1 text-[10px] text-muted">
            <DatabaseIcon className="size-2.5" /> Blog posts · 24 items
          </span>
        </div>
      </div>
    </Fade>
  );
}
