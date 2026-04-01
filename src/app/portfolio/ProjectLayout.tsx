"use client";

import { useEffect, useState } from "react";
import {
  PortfolioChevronLeft,
  PortfolioChevronRight,
} from "@/components/PortfolioChevrons";
import { PageContent } from "@/components/PageContent";
import { PortfolioMobileMenu } from "@/components/PortfolioMobileMenu";
import {
  ProjectNavigation,
  type ProjectNavigationItem,
} from "@/components/ProjectNavigation";
import type { PageContentItem } from "@/components/PageContent";

export type ProjectLayoutProps = {
  children: React.ReactNode;
  navItems: ProjectNavigationItem[];
  pageSections: PageContentItem[];
  activeId: string;
};

export function ProjectLayout({
  children,
  navItems,
  pageSections,
  activeId,
}: ProjectLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMobileMenuOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [activeId]);

  return (
    <>
      <PortfolioMobileMenu
        items={navItems}
        activeId={activeId}
        darkTopBar={false}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpen={() => setIsMobileMenuOpen(true)}
      />

      <div
        className="project relative h-svh max-h-svh min-w-0 w-full max-w-[100svw] font-sans text-[#2B4673] overflow-x-hidden overflow-y-hidden"
        style={{ backgroundColor: "#EDE7E3" }}
      >
        <div className="portfolio-grain-light" aria-hidden />
        <div className="portfolio-grid-light" aria-hidden />
        <div className="relative z-10 grid min-w-0 w-full max-w-[100svw] grid-cols-[1fr] md:grid-cols-[4rem_minmax(0,1fr)_4rem] grid-rows-[1fr_4rem_1fr] h-full overflow-x-hidden overflow-y-hidden mx-auto font-sans text-[#2B4673]">
          <aside
            className="hidden lg:flex flex-col row-start-3 mt-auto"
            aria-label="Project index"
          >
            <div className="row-start-1 row-end-2 pb-6 pl-2">
              {navItems.length > 0 ? (
                <ProjectNavigation items={navItems} activeId={activeId} />
              ) : (
                <div
                  className="w-8 h-32 animate-pulse rounded bg-[#2B4673]/10"
                  aria-hidden
                />
              )}
            </div>
          </aside>

          <div className="row-start-2 col-start-1 col-end-2 row-end-3 min-h-0 hidden md:flex items-center justify-center">
            <PortfolioChevronLeft />
          </div>

          <main
            className="scrollable-project-main min-h-0 min-w-0 align-self-center justify-self-center w-full max-w-4xl xl:max-w-6xl sm:pt-0 row-start-1 -row-end-1 overflow-y-auto overflow-x-hidden scroll-smooth md:py-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2B4673]/40 col-start-1 col-end-2 md:col-start-2 md:col-end-3 row-start-1 row-end-4"
            role="region"
            aria-label="Project content"
            tabIndex={0}
          >
            {children}
          </main>

          <aside
            className="hidden xl:flex min-h-0 w-max relative max-w-none flex-col self-start justify-self-start overflow-visible row-start-1 col-start-3 z-10"
            aria-label="On this page"
          >
            <PageContent sections={pageSections} />
          </aside>
          <div className="min-h-0 hidden md:flex items-center justify-center row-start-2 col-start-3 row-end-3 ml-auto px-4">
            <PortfolioChevronRight />
          </div>
        </div>
      </div>
    </>
  );
}
