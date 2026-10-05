"use client";

import { useState } from "react";
import Image from "next/image";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { WorkProject } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";

// Fonds de remplacement tant que les projets n'ont pas d'image
const PLACEHOLDER_BACKGROUNDS = [
  "bg-[linear-gradient(135deg,#1c1917,#44403c)]",
  "bg-[linear-gradient(135deg,#0f172a,#334155)]",
  "bg-[linear-gradient(135deg,#18181b,#52525b)]",
];

export function WorkSlider({ projects }: { projects: WorkProject[] }) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [current, setCurrent] = useState(0);
  const count = projects.length;
  // Boucle infinie : Swiper a besoin d'au moins 4 slides pour remplir la vue pendant le
  // bouclage. Avec peu de projets, on répète la liste (la pagination reste par projet).
  const slides = Array.from({ length: Math.ceil(4 / count) }, () => projects).flat();

  return (
    <>
      <Swiper
        loop
        // transition plus lente et adoucie (début et fin progressifs)
        speed={850}
        spaceBetween={24}
        slidesPerView={1.15}
        breakpoints={{ 768: { slidesPerView: 1.5 } }}
        grabCursor
        className="!overflow-visible [&_.swiper-wrapper]:ease-[cubic-bezier(0.65,0,0.35,1)]"
        onSwiper={setSwiper}
        onRealIndexChange={(s) => setCurrent(s.realIndex % count)}
      >
        {slides.map((project, i) => (
          <SwiperSlide key={i}>
            <ProjectCard
              project={project}
              placeholder={PLACEHOLDER_BACKGROUNDS[(i % count) % PLACEHOLDER_BACKGROUNDS.length]}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-6 flex items-center justify-between">
        {/* Pagination : une puce par projet, la courante plus longue et gris foncé */}
        <div className="flex items-center gap-2">
          {projects.map((project, i) => (
            <button
              key={project.id}
              type="button"
              aria-label={`Go to ${project.name}`}
              aria-current={i === current}
              onClick={() => swiper?.slideToLoop(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-foreground" : "w-1.5 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Flèches (jamais désactivées : le slider boucle), de la couleur du fond :
            les particules viennent les entourer (data-particles) */}
        <div className="flex gap-2" data-particles="work-arrows">
          <Button size="icon" variant="secondary" aria-label="Previous slide" onClick={() => swiper?.slidePrev()}>
            <ArrowIcon className="size-4 rotate-180" />
          </Button>
          <Button size="icon" variant="secondary" aria-label="Next slide" onClick={() => swiper?.slideNext()}>
            <ArrowIcon />
          </Button>
        </div>
      </div>
    </>
  );
}

function ProjectCard({ project, placeholder }: { project: WorkProject; placeholder: string }) {
  return (
    <a
      href={project.href}
      className={`relative block aspect-video overflow-hidden rounded-2xl text-white ${placeholder}`}
    >
      {project.image && (
        <Image
          src={project.image.url}
          alt={project.image.alt}
          fill
          sizes="(min-width: 768px) 60vw, 85vw"
          className="object-cover"
        />
      )}
      {/* Dégradé sombre de gauche (logo, titre) vers transparent à droite */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />

      {/* Logo en haut à gauche */}
      <div className="absolute top-6 left-6">
        {project.logo ? (
          // hauteur fixe, largeur selon le logo (carré ou horizontal)
          <Image src={project.logo.url} alt={project.logo.alt} width={160} height={32} className="h-8 w-auto" />
        ) : (
          // TODO : remplacer par le vrai logo
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-sm font-medium backdrop-blur-md">
            {project.name[0]}
          </span>
        )}
      </div>

      {/* En bas à gauche : pin avec le type, puis le titre */}
      <div className="absolute bottom-6 left-6 flex flex-col items-start gap-3">
        {project.type && (
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            {project.type}
          </span>
        )}
        <h3 className="text-2xl font-medium sm:text-3xl">{project.name}</h3>
      </div>
    </a>
  );
}
