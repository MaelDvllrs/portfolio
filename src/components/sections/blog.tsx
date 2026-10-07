import { site } from "@/content/site";
import { getPosts } from "@/lib/cms";
import { Section } from "@/components/section";
import { PostCard } from "@/components/post-card";
import { Divider } from "@/components/ui/divider";

// Derniers articles du blog sur l'accueil : 4 cartes sur 2 colonnes, lien vers /blog.
// Rien n'est affiché tant qu'aucun article n'est publié (séparateur de fin compris, pour ne
// pas laisser deux séparateurs collés sur l'accueil).
export async function Blog() {
  const posts = (await getPosts()).slice(0, 4);
  if (!posts.length) return null;

  return (
    <>
      <Section id="blog" title={site.blog.title} action={{ label: "View all", href: "/blog" }}>
        <ul className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </Section>
      <Divider />
    </>
  );
}
