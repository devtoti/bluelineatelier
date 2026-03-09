"use client";

import { useEffect, useState } from "react";

export type PageContentItem = {
  id: string;
  label: string;
};

export type PageContentProps = {
  /** List of sections to show in the "On this page" nav */
  sections: PageContentItem[];
  /** Optional title above the links (default: "On this page") */
  title?: string;
  /** Optional class for the container */
  className?: string;
};

/**
 * "On this page" navigation component (Tailwind docs style).
 * Renders a sticky list of anchor links to page sections and optionally
 * highlights the active section on scroll.
 */
export function PageContent({
  sections,
  title = "On this page",
  className = "",
}: PageContentProps) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0px -66% 0px",
        threshold: 0,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className={`page-content w-52 shrink-0 ${className}`}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2B4673] opacity-80">
        {title}
      </p>
      <ul className="space-y-2 border-l-2 border-[#2B4673]/20 pl-4 text-sm">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block py-0.5 transition-colors hover:text-[#2B4673] ${
                activeId === id
                  ? "font-medium text-[#2B4673]"
                  : "text-[#2B4673]/70"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
