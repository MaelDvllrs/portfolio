import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/cms";
import { formatDate } from "@/lib/format";

// Carte d'article (section Blog de l'accueil) : image 16/9 en haut, puis date, titre, résumé et
// tags. Même style que les cartes de /work (padding commun, lueur en bas au survol).
export function PostCard({ post }: { post: BlogPost }) {
  const locale = useLocale();
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-background p-4 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(130%_90%_at_50%_100%,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent_75%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100"
    >
      <div className="relative aspect-video overflow-hidden rounded-md bg-surface">
        {post.cover && (
          <Image
            src={post.cover.url}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 50rem) 21rem, 85vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="relative flex flex-1 flex-col gap-2">
        <time dateTime={post.publishedAt} className="text-xs text-muted">
          {formatDate(post.publishedAt, locale)}
        </time>
        <h3 className="text-base leading-snug font-medium tracking-tight">{post.title}</h3>
        <p className="line-clamp-2 text-sm text-muted">{post.excerpt}</p>
        {post.tags.length > 0 && (
          // mt-auto : les tags restent en bas, alignés d'une carte à l'autre
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1 text-[0.6875rem] text-muted">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-border px-2 py-0.5">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
