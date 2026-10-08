import { siClaude, siGooglegemini, siPerplexity } from "simple-icons";
import { useTranslations } from "next-intl";
import { site } from "@/content/site";
import { OPENAI_PATH } from "@/components/ui/ai-logos";

// Bandeau « Summarize with » (en haut des articles) : chaque logo ouvre l'IA dans un nouvel onglet
// avec un prompt pré-écrit demandant le résumé de l'article (titre + adresse).
// - ChatGPT, Claude, Perplexity : paramètre `q` de leur page de nouvelle conversation / recherche ;
// - Gemini n'accepte pas de prompt dans l'URL : on passe par le mode IA de Google Search
//   (propulsé par Gemini), qui l'accepte.
export function AiSummary({ url, title }: { url: string; title: string }) {
  const t = useTranslations("Blog");
  // prompt dans la langue de la page : l'IA répond dans cette langue
  const prompt = encodeURIComponent(t("aiPrompt", { title, author: site.name, url }));
  const assistants = [
    { name: "ChatGPT", path: OPENAI_PATH, href: `https://chatgpt.com/?q=${prompt}` },
    { name: "Claude", path: siClaude.path, href: `https://claude.ai/new?q=${prompt}` },
    { name: "Gemini", path: siGooglegemini.path, href: `https://www.google.com/search?udm=50&q=${prompt}` },
    { name: "Perplexity", path: siPerplexity.path, href: `https://www.perplexity.ai/search?q=${prompt}` },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm">
      <p className="text-muted">{t("summarize")}</p>
      <ul className="flex items-center gap-4">
        {assistants.map((a) => (
          <li key={a.name}>
            <a
              href={a.href}
              target="_blank"
              rel="noreferrer"
              aria-label={t("summarizeWith", { assistant: a.name })}
              title={t("summarizeWith", { assistant: a.name })}
              className="block text-muted transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
                <path d={a.path} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
