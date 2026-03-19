"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function PortfolioPageAnimations({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, {
        opacity: 0,
        y: 18,
        duration: 0.65,
        ease: "power2.out",
      });

      const headings = rootRef.current?.querySelector(".headings");
      if (headings) {
        gsap.from(headings.querySelector("h1"), {
          opacity: 0,
          y: 8,
          duration: 2.0,
          delay: 1.0,
          ease: "power2.out",
        });
        gsap.from(headings.querySelector(".inline-flex"), {
          opacity: 0,
          y: 8,
          duration: 2.0,
          delay: 1,
          ease: "power2.out",
        });
        gsap.from(headings.querySelector(".space-y-2"), {
          opacity: 0,
          y: 8,
          duration: 2.0,
          delay: 0.5,
          ease: "power2.out",
        });
      }
      const chevronRight = document.querySelector(".chevron-right");
      if (chevronRight) {
        gsap.fromTo(
          chevronRight,
          { opacity: 0, x: 8 },
          {
            opacity: 1,
            x: 0,
            duration: 1.0,
            delay: 2.5,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(chevronRight, {
                scale: 1.06,
                opacity: 1,
                repeat: -1,
                yoyo: true,
                duration: 0.65,
                ease: "power1.inOut",
              });
            },
          },
        );
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);
  return <div ref={rootRef}>{children}</div>;
}
