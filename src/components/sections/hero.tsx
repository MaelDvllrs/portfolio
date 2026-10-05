"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { siWebflow } from "simple-icons";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";

gsap.registerPlugin(useGSAP, SplitText);

// Hero plein écran sur le fond de la page (couleurs du thème) :
// à gauche, centrés verticalement : titre, preuve sociale, texte et boutons ; logo à droite.
// Seul le texte est animé à l'apparition.
export function Hero() {
  const { hero } = site;
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Découpe en lignes masquées : chaque ligne glisse depuis le bas, sans opacité.
        const title = SplitText.create(titleRef.current, { type: "lines", mask: "lines" });
        const subtitle = SplitText.create(subtitleRef.current, { type: "lines", mask: "lines" });
        // Interligne serré : on agrandit les masques du titre vers le bas pour ne pas couper
        // les jambages (g, p, y). La marge négative compense, la mise en page ne bouge pas.
        gsap.set(title.masks, { paddingBottom: "0.2em", marginBottom: "-0.2em" });
        gsap.set("[data-hero-reveal]", { visibility: "visible" });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => {
              title.revert();
              subtitle.revert();
            },
          })
          // 130 % (et non 100 %) : la ligne doit partir sous le masque agrandi
          .from(title.lines, { yPercent: 130, duration: 1.2, stagger: 0.1 }, 0.3)
          .from(subtitle.lines, { yPercent: 100, duration: 1, stagger: 0.08 }, 0.75)
          // Preuve sociale et boutons : simple fondu
          .from("[data-hero-badge]", { opacity: 0, duration: 0.8 }, 0.6)
          .from("[data-hero-button]", { opacity: 0, duration: 0.8, stagger: 0.1 }, 1.2);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-reveal]", { visibility: "visible" });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      // sans fond propre : les particules (en arrière-plan de la page) doivent rester visibles
      className="relative flex h-svh px-2 text-foreground"
    >
      {/* le logo en particules à droite est dessiné par ParticleField (voir src/app/page.tsx) */}
      {/* invisible jusqu'à l'intro (évite un flash avant l'hydratation) */}
      <div
        data-hero-reveal
        className="invisible relative mx-auto flex w-full max-w-content flex-col justify-end gap-8 px-6 pt-24 pb-10 lg:justify-center lg:pb-0"
      >
        <h1
          ref={titleRef}
          className="max-w-2xl text-6xl leading-[0.95] font-normal tracking-tight text-balance sm:text-7xl lg:text-8xl"
        >
          {hero.title}
        </h1>

        <div className="flex max-w-md flex-col gap-6">
          {/* Preuve sociale : partenaire certifié Webflow */}
          <p data-hero-badge className="flex items-center gap-2 text-xs font-medium">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
              <path d={siWebflow.path} />
            </svg>
            Webflow Certified Partner
          </p>
          <p ref={subtitleRef} className="text-base text-pretty text-muted">
            {hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink data-hero-button href={hero.primaryCta.href} variant="primary">
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink data-hero-button href={hero.secondaryCta.href} variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
