"use client";

import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { WorkProject } from "@/lib/cms";
import { ProjectCard, placeholderFor } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";

// `loop` : boucle infinie (accueil). Sans boucle (pages service), le slider s'arrête au premier
// et au dernier projet, et les flèches se désactivent aux extrémités.
export function WorkSlider({ projects, loop = true }: { projects: WorkProject[]; loop?: boolean }) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [current, setCurrent] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: projects.length <= 1 });
  const count = projects.length;
  // Boucle infinie : Swiper a besoin d'au moins 4 slides pour remplir la vue pendant le
  // bouclage. Avec peu de projets, on répète la liste (la pagination reste par projet).
  const slides = loop ? Array.from({ length: Math.ceil(4 / count) }, () => projects).flat() : projects;

  return (
    <>
      <Swiper
        loop={loop}
        // transition plus lente et adoucie (début et fin progressifs)
        speed={850}
        spaceBetween={24}
        slidesPerView={1.15}
        breakpoints={{ 768: { slidesPerView: 1.5 } }}
        grabCursor
        className="!overflow-visible [&_.swiper-wrapper]:ease-[cubic-bezier(0.65,0,0.35,1)]"
        onSwiper={setSwiper}
        onRealIndexChange={(s) => setCurrent(s.realIndex % count)}
        onSlideChange={(s) => setEdges({ start: s.isBeginning, end: s.isEnd })}
        onReachEnd={() => setEdges((e) => ({ ...e, end: true }))}
      >
        {slides.map((project, i) => (
          <SwiperSlide key={i}>
            <ProjectCard
              project={project}
              placeholder={placeholderFor(i % count)}
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
              onClick={() => (loop ? swiper?.slideToLoop(i) : swiper?.slideTo(i))}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-foreground" : "w-1.5 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Flèches (désactivées aux extrémités quand le slider ne boucle pas), de la couleur du fond :
            les particules viennent les entourer (data-particles) */}
        <div className="flex gap-2" data-particles="work-arrows">
          <Button
            size="icon"
            variant="secondary"
            aria-label="Previous slide"
            disabled={!loop && edges.start}
            onClick={() => swiper?.slidePrev()}
          >
            <ArrowIcon className="size-4 rotate-180" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            aria-label="Next slide"
            disabled={!loop && edges.end}
            onClick={() => swiper?.slideNext()}
          >
            <ArrowIcon />
          </Button>
        </div>
      </div>
    </>
  );
}
