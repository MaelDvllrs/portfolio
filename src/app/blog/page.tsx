import type { Metadata } from "next";
import { site } from "@/content/site";
import { getPosts } from "@/lib/cms";
import { Frame } from "@/components/frame";
import { PostRow } from "@/components/post-row";
import { Divider } from "@/components/ui/divider";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: `Blog — ${site.name}`,
  description: site.blog.intro,
  alternates: { canonical: "/blog" },
};

// Liste des articles (CMS, collection `posts`), du plus récent au plus ancien.
export default async function BlogPage() {
  const { blog } = site;
  const posts = await getPosts();

  return (
    // pt-14 : sous le header fixe
    <main className="flex-1 pt-14">
      <Frame as="div" className="py-6">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-lg leading-tight font-bold">{blog.title}</h1>
          <span className="text-sm text-muted">
            {posts.length} article{posts.length === 1 ? "" : "s"}
          </span>
        </div>
        <p className="mt-2 max-w-md text-sm text-muted">{blog.intro}</p>
      </Frame>

      <Divider />

      <Frame as="div" className="py-6">
        {posts.length ? (
          <ul className="grid gap-6">
            {posts.map((post) => (
              <li key={post.id}>
                <PostRow post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-sm text-muted">First articles coming soon.</p>
        )}
      </Frame>

      <Divider />
      <Contact />
      <Divider />
    </main>
  );
}
