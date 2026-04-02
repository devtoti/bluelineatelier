"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

export function TableOfContentsGridClient({
  className = "",
  itemCount,
  children,
}: {
  className?: string;
  itemCount: number;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const cards =
      sectionRef.current.querySelectorAll<HTMLElement>(".toc-card-link");
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 24,
        duration: 1.0,
        stagger: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [itemCount]);

  return (
    <section
      ref={sectionRef}
      aria-label="Table of Contents"
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch ${className}`}
    >
      {children}
    </section>
  );
}
