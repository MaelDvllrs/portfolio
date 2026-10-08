import { siGithub } from "simple-icons";
import { site } from "@/content/site";

// Nombre d'étoiles du dépôt public (API GitHub, sans clé), mis en cache 1 h ; null si indisponible
// (limite de l'API atteinte, réseau…) : le bouton s'affiche alors sans compteur.
async function getStars(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data: { stargazers_count?: number } = await res.json();
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

const compact = new Intl.NumberFormat("en", { notation: "compact" });

// Bouton « Star » du dépôt du portfolio sur GitHub : logo | nombre d'étoiles, dans un cadre compact.
export async function GitHubStar() {
  const stars = await getStars(site.repo);

  return (
    <a
      href={`https://github.com/${site.repo}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Star ${site.repo} on GitHub${stars !== null ? ` (${stars} stars)` : ""}`}
      className="flex h-7 items-center overflow-hidden rounded-md border border-border text-xs font-medium text-muted transition-colors hover:text-foreground"
    >
      <span className="flex items-center px-1.5">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden>
          <path d={siGithub.path} />
        </svg>
      </span>
      {stars !== null && (
        <span className="flex h-full items-center border-l border-border px-1.5 tabular-nums">{compact.format(stars)}</span>
      )}
    </a>
  );
}
