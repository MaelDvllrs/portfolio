import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/cms";
import { formatDate } from "@/lib/format";

// Ligne de la liste des articles (/blog) : vignette à gauche, puis date, titre, résumé et tags.
// Même lueur au survol que les cartes de /work.
// `heading` : balise du titre, h2 (liste /blog) ou h3 (« More posts », sous un titre de section h2)
export function PostRow({ post, heading: Heading = "h2" }: { post: BlogPost; heading?: "h2" | "h3" }) {
  const locale = useLocale();
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative grid gap-4 rounded-2xl border border-border bg-background p-4 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(130%_90%_at_50%_100%,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent_75%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 sm:grid-cols-[13rem_1fr]"
    >
      {/* sur grand écran : toute la hauteur de la carte (au moins le 16/9 de sa largeur) */}
      <div className="relative aspect-video overflow-hidden rounded-md bg-surface sm:aspect-auto sm:h-full sm:min-h-[7.3rem]">
        {post.cover && (
          <Image
            src={post.cover.url}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 40rem) 13rem, 90vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="relative flex flex-col gap-2">
        <time dateTime={post.publishedAt} className="text-xs text-muted">
          {formatDate(post.publishedAt, locale)}
        </time>
        <Heading className="text-base leading-snug font-medium tracking-tight">{post.title}</Heading>
        <p className="line-clamp-2 text-sm text-muted">{post.excerpt}</p>
        {post.tags.length > 0 && (
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
