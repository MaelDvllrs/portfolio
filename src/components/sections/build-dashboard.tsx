import { ClaudeLogo, GeminiLogo, OpenAILogo } from "@/components/ui/ai-logos";

// Dashboard en skeleton, partagé par deux étapes :
// - BUILD (étape 2) : il se construit bloc par bloc au fil du scroll ;
// - INTELLIGENCE (étape 3) : les logos Claude, OpenAI et Gemini arrivent par les côtés et
//   chacun colore une partie du dashboard (une stat + un tiers des barres).
//
// Pas d'animation ici : le parent anime chaque élément `data-anim`.
//   block  → apparaît en montant légèrement     grow-x → s'étire depuis la gauche
//   grow-y → pousse depuis le bas                enter  → entre par le côté (logos)
//   fade   → fondu (couches de couleur)
// `data-at` rattache un élément à une autre étape que celle de son écran ;
// `data-order` regroupe les éléments joués en même temps (sinon : ordre du DOM).
// L'état initial (invisible) est posé en inline pour éviter un flash avant l'hydratation.

const hiddenBlock = { opacity: 0, transform: "translateY(6px)" };
const hiddenX = { transform: "scaleX(0)", transformOrigin: "left" };
const hiddenY = { transform: "scaleY(0)", transformOrigin: "bottom" };
const hiddenColor = { opacity: 0 };

const INTELLIGENCE_STEP = 2;

// Chaque IA apporte sa couleur, dans l'ordre d'arrivée
const AI = [
  { name: "Claude", Logo: ClaudeLogo, color: "#D97757", from: "left", position: "top-[30%] left-[8%]" },
  { name: "OpenAI", Logo: OpenAILogo, color: "#10A37F", from: "right", position: "bottom-[4%] right-[4%]" },
  { name: "Gemini", Logo: GeminiLogo, color: "#3186FF", from: "left", position: "bottom-[14%] left-[30%]" },
] as const;

// Hauteurs des barres du graphique (en %) ; chaque tiers prend la couleur d'une IA
const BARS = [35, 52, 44, 68, 58, 74, 62, 85, 70, 92, 78, 96];
const aiForBar = (i: number) => Math.floor((i * AI.length) / BARS.length);

/** Couche de couleur posée sur un élément, révélée à l'étape INTELLIGENCE */
function ColorLayer({ ai, className = "" }: { ai: number; className?: string }) {
  return (
    <span
      className={`absolute inset-0 ${className}`}
      style={{ ...hiddenColor, backgroundColor: AI[ai].color }}
      data-anim="fade"
      data-at={INTELLIGENCE_STEP}
      data-order={ai * 2 + 1}
      data-duration={0.5}
    />
  );
}

function Line({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block h-2 rounded-full bg-neutral-200 ${className}`}
      style={hiddenX}
      data-anim="grow-x"
      data-duration={0.4}
    />
  );
}

function Card({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-white p-3 ${className}`}
      style={hiddenBlock}
      data-anim="block"
      data-duration={0.6}
    >
      {children}
    </div>
  );
}

export function BuildDashboard() {
  return (
    <div className="relative flex h-full w-full gap-3 text-left" aria-hidden>
      {/* Sidebar */}
      <Card className="flex w-1/5 flex-col gap-3">
        <span
          className="block size-5 rounded-md bg-neutral-900"
          style={hiddenBlock}
          data-anim="block"
          data-duration={0.3}
        />
        <div className="mt-2 flex flex-col gap-2.5">
          <Line className="w-4/5" />
          <Line className="w-3/5" />
          <Line className="w-2/3" />
          <Line className="w-1/2" />
        </div>
      </Card>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Barre du haut */}
        <div className="flex items-center justify-between">
          <Line className="h-3 w-1/4 bg-neutral-300" />
          <span
            className="block size-6 rounded-full bg-neutral-200"
            style={hiddenBlock}
            data-anim="block"
            data-duration={0.3}
          />
        </div>

        {/* Statistiques : la valeur de chacune prend la couleur d'une IA */}
        <div className="grid grid-cols-3 gap-3">
          {["w-3/5", "w-1/2", "w-2/3"].map((w, i) => (
            <Card key={w} className="flex flex-col gap-2">
              <Line className="w-1/2" />
              <span className={`relative block h-4 overflow-hidden rounded-full ${w}`}>
                <Line className="h-full w-full bg-neutral-800" />
                <ColorLayer ai={i} />
              </span>
            </Card>
          ))}
        </div>

        {/* Graphique */}
        <Card className="flex min-h-0 flex-1 items-end gap-1.5">
          {BARS.map((h, i) => (
            <span
              key={i}
              className="relative block flex-1 overflow-hidden rounded-t-sm bg-neutral-800"
              style={{ ...hiddenY, height: `${h}%` }}
              data-anim="grow-y"
              data-duration={0.15}
            >
              <ColorLayer ai={aiForBar(i)} />
            </span>
          ))}
        </Card>

        {/* Tableau */}
        <Card className="flex flex-col gap-2.5">
          {["w-11/12", "w-4/5", "w-5/6"].map((w) => (
            <Line key={w} className={w} />
          ))}
        </Card>
      </div>

      {/* Logos des IA : entrent par la gauche ou la droite, puis colorent leur partie */}
      {AI.map(({ name, Logo, from, position }, i) => (
        <div
          key={name}
          className={`absolute ${position} flex items-center gap-2 rounded-xl border border-neutral-200 bg-white py-2 pr-3 pl-2 shadow-lg shadow-black/5`}
          style={{
            opacity: 0,
            transform: `translateX(${from === "left" ? "-160px" : "160px"})`,
          }}
          data-anim="enter"
          data-at={INTELLIGENCE_STEP}
          data-order={i * 2}
          data-duration={0.6}
        >
          <Logo className="size-6 text-neutral-900" />
          <span className="text-sm font-medium text-neutral-900">{name}</span>
        </div>
      ))}
    </div>
  );
}
