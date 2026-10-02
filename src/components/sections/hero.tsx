"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import backgroundHero from "@/assets/image/background_hero.avif";
import heroFirstPlan from "@/assets/image/hero_first_plan.avif";

gsap.registerPlugin(useGSAP, SplitText);

// Dimensions réelles des images, en dur : Turbopack ne lit pas les dimensions des AVIF
// importés (il renvoie 1×1). À mettre à jour si les images changent.
const BG = { width: 2500, height: 1401 };
const FG = { width: 2500, height: 783 };
const BG_RATIO = BG.width / BG.height;

// Calques (du fond vers l'avant) : arrière-plan → titre → premier plan → fondu → texte + boutons.
// Les deux images sont statiques ; seul le texte est animé à l'apparition.
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
          // Boutons : simple fondu, une fois le texte presque en place
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
      // Conteneur de taille : cqw/cqh = dimensions du hero (sans la scrollbar).
      // --fg-w : largeur du premier plan, qui reproduit le object-cover du fond.
      // --fg-h : sa hauteur rendue, d'après les proportions de l'image.
      className="relative isolate h-svh overflow-hidden bg-neutral-950 text-white [container-type:size]"
      style={
        {
          "--fg-w": `max(100cqw, 100cqh * ${BG_RATIO})`,
          "--fg-h": `calc(var(--fg-w) * ${FG.height / FG.width})`,
        } as React.CSSProperties
      }
    >
      <Image
        src={backgroundHero}
        alt=""
        fill
        sizes="100vw"
        fetchPriority="high"
        loading="eager"
        className="object-cover brightness-90" // fond légèrement assombri
      />

      {/* Titre derrière le premier plan, calé à gauche du contenu. Sur grand écran, plongé dans
          les vagues (3.5rem sous le haut de l'image) pour être masqué de façon irrégulière ;
          sur mobile, à peine enfoncé (2rem) pour rester lisible.
          Invisible jusqu'à l'intro (évite un flash avant l'hydratation). */}
      <div
        className="absolute inset-x-0 px-2 [--title-overlap:2rem] lg:[--title-overlap:3.5rem]"
        style={{ bottom: "calc(var(--fg-h) - var(--title-overlap))" }}
      >
        <div className="mx-auto max-w-content px-6">
          <h1
            ref={titleRef}
            data-hero-reveal
            className="invisible max-w-5xl text-left text-6xl lg:pl-12 leading-[0.95] font-normal tracking-tight text-balance sm:text-8xl"
          >
            {hero.title}
          </h1>
        </div>
      </div>

      {/* Premier plan ancré en bas, à la même échelle que le fond */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: "var(--fg-w)" }}
      >
        <Image
          src={heroFirstPlan}
          width={FG.width}
          height={FG.height}
          alt=""
          sizes={`(max-aspect-ratio: ${BG.width}/${BG.height}) ${Math.ceil(BG_RATIO * 100)}vh, 100vw`}
          fetchPriority="high"
          loading="eager"
          className="block h-auto w-full"
        />
      </div>

      {/* Fondu noir en bas pour faire ressortir les textes */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Texte + boutons, fixes en bas à droite */}
      <div className="absolute inset-x-0 bottom-0 px-2">
        <div
          data-hero-reveal
          className="invisible mx-auto flex max-w-content justify-end px-6 pb-8 sm:pb-10"
        >
          <div className="flex max-w-sm flex-col gap-6 lg:items-end">
            <p ref={subtitleRef} className="text-base text-pretty text-white/90 lg:text-right">
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink data-hero-button href={hero.primaryCta.href} variant="brand">
                {hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink data-hero-button href={hero.secondaryCta.href} variant="glass">
                {hero.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
