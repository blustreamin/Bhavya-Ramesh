"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Options = {
  /** Selector for the children to stagger-reveal within the container. */
  childSelector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
};

/**
 * Reveals a container (or its matched children) with a fade + rise as it
 * scrolls into view. Returns a ref to attach to the wrapping element.
 * Respects `prefers-reduced-motion`.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  childSelector,
  y = 40,
  duration = 0.8,
  stagger = 0.12,
}: Options = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = childSelector
      ? Array.from(el.querySelectorAll<HTMLElement>(childSelector))
      : [el];

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [childSelector, y, duration, stagger]);

  return ref;
}
