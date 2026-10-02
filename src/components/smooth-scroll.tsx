"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scroll fluide global. Lenis est piloté par le ticker GSAP pour que
// ScrollTrigger et le scroll restent synchronisés à la même frame.
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false, anchors: true });
    const update = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger mesure les positions à sa création. Si la page change de hauteur ensuite
    // (CSS injecté en retard en dev, init de Swiper/Splide, images, polices), ses positions
    // deviennent fausses. On recalcule dès que la hauteur du document change.
    let timeout: ReturnType<typeof setTimeout>;
    let lastHeight = document.documentElement.scrollHeight;
    const observer = new ResizeObserver(() => {
      const height = document.documentElement.scrollHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      clearTimeout(timeout);
      timeout = setTimeout(() => ScrollTrigger.refresh(), 100);
    });
    observer.observe(document.body);
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return null;
}
