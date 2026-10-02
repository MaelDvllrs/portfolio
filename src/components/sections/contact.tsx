import { site } from "@/content/site";
import { Frame } from "@/components/frame";
import { ButtonLink } from "@/components/ui/button";
import { DotGrid } from "@/components/ui/dot-grid";
import { ArrowIcon } from "@/components/ui/icons";

export function Contact() {
  const { contact } = site;
  return (
    <Frame id="contact" className="relative overflow-hidden py-40 text-center sm:py-56">
      <DotGrid />
      <div className="relative">
        {/* Texte couleur du fond de la page, à contour couleur du texte (paint-order : le contour passe sous le remplissage,
            il ne mange pas l'intérieur des lettres) */}
        <h2 className="text-[min(13vw,13rem)] leading-none font-normal tracking-normal whitespace-nowrap text-background [paint-order:stroke_fill] [-webkit-text-stroke:3px_var(--foreground)]">
          {contact.title}
        </h2>
        <ButtonLink href={`mailto:${site.email}`} variant="primary" size="lg" className="mt-12">
          {contact.cta}
          <ArrowIcon className="size-5" />
        </ButtonLink>
      </div>
    </Frame>
  );
}
