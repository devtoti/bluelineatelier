"use client";

import type { MouseEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const PROJECT_INFO_ID = "project-info";
const SCROLL_TOP_THRESHOLD = 24;
const ACTIVATION_LINE_OFFSET_PX = 96;

export type PageContentItem = {
  id: string;
  label: string;
};

export type PageContentProps = {
  sections: PageContentItem[];
  title?: string;
  className?: string;
};

function getScrollContainer(): HTMLElement | null {
  return document.querySelector(
    'main[aria-label="Project content"]',
  ) as HTMLElement | null;
}

export function PageContent({
  sections,
  title = "On this page",
  className = "",
}: PageContentProps) {
  const [activeId, setActiveId] = useState<string | null>(PROJECT_INFO_ID);

  const scrollToTop = () => {
    setActiveId(PROJECT_INFO_ID);
    const el = getScrollContainer();
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateActiveFromScrollPosition = useCallback(() => {
    const root = getScrollContainer();
    if (!root) return;

    const { scrollTop, clientHeight, scrollHeight } = root;

    if (scrollTop < SCROLL_TOP_THRESHOLD) {
      setActiveId(PROJECT_INFO_ID);
      return;
    }

    if (
      sections.length > 0 &&
      scrollTop + clientHeight >= scrollHeight - SCROLL_TOP_THRESHOLD
    ) {
      setActiveId(sections[sections.length - 1]!.id);
      return;
    }

    const markerY = root.getBoundingClientRect().top + ACTIVATION_LINE_OFFSET_PX;
    let active = sections[0]?.id ?? PROJECT_INFO_ID;
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= markerY) {
        active = id;
      }
    }
    setActiveId(active);
  }, [sections]);

  useEffect(() => {
    const root = getScrollContainer();
    if (!root) return;

    root.addEventListener("scroll", updateActiveFromScrollPosition, {
      passive: true,
    });
    window.addEventListener("resize", updateActiveFromScrollPosition);

    const ro = new ResizeObserver(() => updateActiveFromScrollPosition());
    ro.observe(root);

    const id = requestAnimationFrame(() => updateActiveFromScrollPosition());

    return () => {
      cancelAnimationFrame(id);
      root.removeEventListener("scroll", updateActiveFromScrollPosition);
      window.removeEventListener("resize", updateActiveFromScrollPosition);
      ro.disconnect();
    };
  }, [updateActiveFromScrollPosition]);

  useEffect(() => {
    const onHashChange = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) {
        setActiveId(PROJECT_INFO_ID);
        return;
      }
      if (sections.some((s) => s.id === raw)) {
        setActiveId(raw);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [sections]);

  const onSectionLinkClick = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${id}`);
    requestAnimationFrame(() => updateActiveFromScrollPosition());
  };

  const linkClass = (id: string) =>
    `block py-0.5 transition-colors hover:text-[#2B4673] ${
      activeId === id ? "font-medium text-[#2B4673]" : "text-[#2B4673]/70"
    }`;
  const liClass = (id: string) =>
    activeId === id ? "border-l-3 border-[#2B4673] pl-4" : "pl-4";

  return (
    <nav
      aria-label="On this page"
      className={`page-content absolute top-0 right-2 w-fit mt-16 shrink-0 ${className}`}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2B4673] opacity-80 whitespace-nowrap">{title}</p>
      <ul className="space-y-2 border-l-2 border-[#2B4673]/20 -ml-2 text-sm">
        <li key={PROJECT_INFO_ID} className={liClass(PROJECT_INFO_ID)}>
          <button
            type="button"
            onClick={scrollToTop}
            className={`w-full text-left ${linkClass(PROJECT_INFO_ID)}`}
          >
            Title
          </button>
        </li>
        {sections.map(({ id, label }) => (
          <li key={id} className={liClass(id)}>
            <Link
              href={`#${id}`}
              className={linkClass(id)}
              onClick={onSectionLinkClick(id)}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
