import { withHeadingIds } from "@/lib/rich-text";
import { TableOfContents } from "@/components/table-of-contents";

// Texte riche du CMS (HTML de confiance, déjà sans enveloppe) avec, à gauche, le menu des h3 :
// menu à 30 % (collant), texte à 70 % ; sur mobile, texte seul en pleine largeur.
// Pages projet (/work/<slug>) et articles (/blog/<slug>).
export function RichTextWithToc({ html }: { html: string }) {
  const content = withHeadingIds(html);
  return (
    <div className="sm:flex sm:justify-end">
      {content.headings.length > 0 && (
        <div className="w-[30%] pr-6 max-sm:hidden">
          <TableOfContents headings={content.headings} />
        </div>
      )}
      <div className="prose-content sm:w-[70%]" dangerouslySetInnerHTML={{ __html: content.html }} />
    </div>
  );
}
