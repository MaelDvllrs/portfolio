import { withHeadingIds } from "@/lib/rich-text";
import { TableOfContents } from "@/components/table-of-contents";

// Texte riche du CMS (HTML de confiance, déjà sans enveloppe) avec, à gauche, le menu des titres :
// menu à 30 % (collant), texte à 70 % ; sur mobile, texte seul en pleine largeur.
// `headingLevel` : niveau des titres du menu (h3 par défaut : projets, services ; h2 : articles).
export function RichTextWithToc({ html, headingLevel = 3 }: { html: string; headingLevel?: 2 | 3 }) {
  const content = withHeadingIds(html, headingLevel);
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
