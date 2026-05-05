"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollChoreography() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const sequence = document.querySelector("[data-scroll-sequence]");
    if (!sequence) {
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sequence,
        start: "top center",
        end: "bottom center",
        scrub: true,
        onUpdate: (self) => {
          document.documentElement.style.setProperty(
            "--playhead-progress",
            `${self.progress * 100}%`
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
