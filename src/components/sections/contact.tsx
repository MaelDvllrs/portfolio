import { useTranslations } from "next-intl";
import { Frame } from "@/components/frame";
import { ButtonLink } from "@/components/ui/button";
import { DotGrid } from "@/components/ui/dot-grid";
import { ArrowIcon } from "@/components/ui/icons";

export function Contact() {
  const t = useTranslations("ContactSection");
  const contact = { title: t("title"), cta: t("cta") };
  return (
    <Frame id="contact" className="relative overflow-hidden py-16 text-center sm:py-20">
      <DotGrid />
      <div className="relative">
        {/* Texte couleur du fond de la page, à contour couleur du texte (paint-order : le contour passe sous le remplissage,
            il ne mange pas l'intérieur des lettres) */}
        <h2 className="text-[min(12vw,5.5rem)] leading-none font-normal tracking-normal whitespace-nowrap text-background [paint-order:stroke_fill] [-webkit-text-stroke:2px_var(--foreground)]">
          {contact.title}
        </h2>
        <ButtonLink
          href="/contact"
          variant="primary"
          className="mt-6"
          data-particles="contact-cta"
        >
          {contact.cta}
          <ArrowIcon />
        </ButtonLink>
      </div>
    </Frame>
  );
}
