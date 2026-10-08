import { siFacebook, siReddit, siX } from "simple-icons";
import { SOCIAL_ICONS } from "@/components/ui/social-icons";

// Liens de partage d'une page (articles du blog) : LinkedIn, X, Facebook, Reddit.
// Simples liens vers les pages de partage de chaque réseau (aucun script tiers), ouverts dans un
// nouvel onglet ; icônes seules, nom en infobulle et pour les lecteurs d'écran.
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const networks = [
    { name: "LinkedIn", path: SOCIAL_ICONS.LinkedIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "X", path: siX.path, href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { name: "Facebook", path: siFacebook.path, href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "Reddit", path: siReddit.path, href: `https://www.reddit.com/submit?url=${u}&title=${t}` },
  ];

  return (
    <div className="flex items-center gap-3 text-xs text-muted">
      <span>Share</span>
      <ul className="flex items-center gap-3">
        {networks.map((n) => (
          <li key={n.name}>
            <a
              href={n.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Share on ${n.name}`}
              title={`Share on ${n.name}`}
              className="block transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden>
                <path d={n.path} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
