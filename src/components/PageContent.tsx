"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PROJECT_INFO_ID = "project-info";
const SCROLL_TOP_THRESHOLD = 24;

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

function getScrollContainer(): HTMLElement | null {
  return document.querySelector(
    'main[aria-label="Project content"]',
  ) as HTMLElement | null;
}

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
  const [activeId, setActiveId] = useState<string | null>(PROJECT_INFO_ID);

  const scrollToTop = () => {
    const el = getScrollContainer();
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const scrollContainer = getScrollContainer();

    const updateActiveFromScroll = () => {
      if (!scrollContainer) return;
      const { scrollTop, clientHeight, scrollHeight } = scrollContainer;
      if (scrollTop < SCROLL_TOP_THRESHOLD) {
        setActiveId(PROJECT_INFO_ID);
        return;
      }
      const atBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_TOP_THRESHOLD;
      if (atBottom && sections.length > 0) {
        const lastId = sections[sections.length - 1]?.id ?? null;
        if (lastId) setActiveId(lastId);
      }
    };

    const observer =
      sections.length > 0
        ? new IntersectionObserver(
            (entries) => {
              if (scrollContainer) {
                const { scrollTop, clientHeight, scrollHeight } =
                  scrollContainer;
                if (scrollTop < SCROLL_TOP_THRESHOLD) {
                  setActiveId(PROJECT_INFO_ID);
                  return;
                }
                const atBottom =
                  scrollTop + clientHeight >=
                  scrollHeight - SCROLL_TOP_THRESHOLD;
                if (atBottom) {
                  const lastId = sections[sections.length - 1]?.id ?? null;
                  if (lastId) {
                    setActiveId(lastId);
                    return;
                  }
                }
              }
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
            },
          )
        : null;

    if (observer) {
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateActiveFromScroll, {
        passive: true,
      });
      updateActiveFromScroll();
    }

    return () => {
      observer?.disconnect();
      scrollContainer?.removeEventListener("scroll", updateActiveFromScroll);
    };
  }, [sections]);

  const linkClass = (id: string) =>
    `block py-0.5 transition-colors hover:text-[#2B4673] ${
      activeId === id ? "font-medium text-[#2B4673]" : "text-[#2B4673]/70"
    }`;
  const liClass = (id: string) =>
    activeId === id ? "border-l-3 border-[#2B4673] -ml-[18px] pl-4" : "";

  return (
    <nav
      aria-label="On this page"
      className={`page-content w-52 mt-16 shrink-0 ${className}`}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2B4673] opacity-80">
        {title}
      </p>
      <ul className="space-y-2 border-l-2 border-[#2B4673]/20 pl-4 text-sm">
        <li key={PROJECT_INFO_ID} className={liClass(PROJECT_INFO_ID)}>
          <button
            type="button"
            onClick={scrollToTop}
            className={`w-full text-left ${linkClass(PROJECT_INFO_ID)}`}
          >
            Project info
          </button>
        </li>
        {sections.map(({ id, label }) => (
          <li key={id} className={liClass(id)}>
            <Link href={`#${id}`} className={linkClass(id)}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
