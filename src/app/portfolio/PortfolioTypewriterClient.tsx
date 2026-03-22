"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const PHRASES = [
  "arkitekturportefølje",
  "computation i arkitektur",
  "architecture portfolio",
  "computation in architecture",
  "portafolio de arquitectura",
  "computación en arquitectura",
];

export function PortfolioTypewriterClient() {
  const pathname = usePathname();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (pathname !== "/portfolio") return;

    let attempts = 0;

    const start = () => {
      const el = document.querySelector(
        '[data-typewriter-text]',
      ) as HTMLElement | null;
      if (!el) {
        attempts += 1;
        if (attempts < 20) {
          timeoutRef.current = window.setTimeout(start, 50);
        }
        return;
      }

      el.textContent = "";

      let index = 0;
      let text = "";
      let isDeleting = false;

      const tick = () => {
        const current = PHRASES[index];

        if (!isDeleting && text === current) {
          timeoutRef.current = window.setTimeout(() => {
            isDeleting = true;
            tick();
          }, 900);
          return;
        }

        if (isDeleting && text === "") {
          isDeleting = false;
          index = (index + 1) % PHRASES.length;
        }

        text = isDeleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1);

        el.textContent = text;
        timeoutRef.current = window.setTimeout(tick, isDeleting ? 60 : 100);
      };

      tick();
    };

    start();

    return () => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = null;
    };
  }, [pathname]);

  return null;
}

