import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";

type Item = { slug: string; label: string };

// Flèches « précédent / suivant » entre les pages d'une liste (articles, services), mêmes boutons
// que le slider Work en compact, à la hauteur d'un texte. En boucle : depuis le dernier élément,
// « suivant » revient au premier ; rien n'est affiché s'il n'y a qu'un élément.
export function PrevNext({
  items,
  currentSlug,
  basePath,
  noun,
}: {
  /** Éléments dans l'ordre de la liste */
  items: Item[];
  currentSlug: string;
  /** Chemin des pages, ex. "/blog" → /blog/<slug> */
  basePath: string;
  /** Nom de l'élément (déjà traduit) pour les libellés accessibles, ex. "post" / "Article" */
  noun: string;
}) {
  const t = useTranslations("Common");
  if (items.length < 2) return null;
  const index = items.findIndex((i) => i.slug === currentSlug);
  const prev = items[(index - 1 + items.length) % items.length];
  const next = items[(index + 1) % items.length];

  return (
    <div className="flex gap-1.5">
      <ButtonLink
        href={`${basePath}/${prev.slug}`}
        variant="secondary"
        size="icon-sm"
        aria-label={t("previous", { noun, label: prev.label })}
        title={prev.label}
      >
        <ArrowIcon className="size-2.5 rotate-180" />
      </ButtonLink>
      <ButtonLink
        href={`${basePath}/${next.slug}`}
        variant="secondary"
        size="icon-sm"
        aria-label={t("next", { noun, label: next.label })}
        title={next.label}
      >
        <ArrowIcon className="size-2.5" />
      </ButtonLink>
    </div>
  );
}
