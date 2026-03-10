"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PortfolioChevronLeft,
  PortfolioChevronRight,
} from "@/components/PortfolioChevrons";
import { ProjectNavigation } from "@/components/ProjectNavigation";
import { PageContent } from "@/components/PageContent";
import {
  getProjectLayoutData,
  getPortfolioNavItems,
} from "@/app/portfolio/actions";
import type { ProjectLayoutData } from "@/app/portfolio/actions";
import type { ProjectNavigationItem } from "@/components/ProjectNavigation";
import HandsBackground from "@/components/HandsBackground";
const PROJECT_ID_REGEX = /^\/portfolio\/projects\/(01|02|03|04|05|06)$/;
const IS_ROUTE_00 = (path: string | null) => path === "/portfolio/00";

export function PortfolioLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [layoutData, setLayoutData] = useState<
    ProjectLayoutData | null | undefined
  >(undefined);
  const [navItems00, setNavItems00] = useState<ProjectNavigationItem[] | null>(
    null,
  );

  const isProjectPage = pathname?.match(PROJECT_ID_REGEX);
  const projectId = isProjectPage ? (pathname?.split("/").pop() ?? null) : null;
  const isRoute00 = IS_ROUTE_00(pathname ?? null);

  useEffect(() => {
    if (!projectId) {
      const id = requestAnimationFrame(() => setLayoutData(null));
      return () => cancelAnimationFrame(id);
    }
    let cancelled = false;
    getProjectLayoutData(projectId).then((data) => {
      if (!cancelled) setLayoutData(data ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  useEffect(() => {
    if (!isRoute00) {
      const id = requestAnimationFrame(() => setNavItems00(null));
      return () => cancelAnimationFrame(id);
    }
    let cancelled = false;
    getPortfolioNavItems().then((items) => {
      if (!cancelled) setNavItems00(items);
    });
    return () => {
      cancelled = true;
    };
  }, [isRoute00]);

  const showNavOnFallback = isRoute00 && navItems00 !== null;

  // Show light project layout as soon as we're on a project route so the bg never flashes dark.
  // Sidebars use layoutData when available; until then they get empty data to avoid layout shift.
  if (isProjectPage) {
    const navItems = layoutData?.projectNavItems ?? [];
    const pageSections = layoutData?.pageSections ?? [];
    const activeId = layoutData?.activeId ?? projectId ?? "";

    return (
      <div
        className="project relative h-svh max-h-svh font-sans text-[#2B4673] overflow-hidden"
        style={{ backgroundColor: "#EDE7E3" }}
      >
        <div className="portfolio-grain-light" aria-hidden />
        <div className="portfolio-grid-light" aria-hidden />
        <div className="relative z-10 grid grid-cols-[4rem_1fr_14rem] grid-rows-[1fr_4rem_1fr] h-full w-full max-w-svw  overflow-y-hidden mx-auto font-sans text-[#2B4673]">
          <HandsBackground />
          <aside
            className="flex flex-col hidden lg:flex row-start-3 mt-auto"
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
          <div className="row-start-2 col-start-1 col-end-2 row-end-3 min-h-0 flex items-center justify-center">
            <PortfolioChevronLeft />
          </div>

          <main
            className="scrollable-project-main min-h-0 row-start-1 -row-end-1 overflow-y-auto overflow-x-hidden scroll-smooth py-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2B4673]/40 col-start-2 col-end-3 row-start-1 row-end-4"
            role="region"
            aria-label="Project content"
            tabIndex={0}
          >
            {children}
          </main>

          <aside
            className="hidden lg:flex flex-col h-min w-min pr-4 w-52 shrink-0 row-start-1 col-start-3"
            aria-label="On this page"
          >
            <PageContent sections={pageSections} />
          </aside>
          <div className="min-h-0 flex items-center justify-center row-start-2 col-start-3 row-end-3 ml-auto px-4">
            <PortfolioChevronRight />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-[4rem_1fr_4rem] grid-rows-[1fr_4rem_1fr] min-h-svh min-w-0 w-full max-w-full overflow-hidden"
      style={{ backgroundColor: "#0C1222" }}
    >
      <HandsBackground />
      <div className="portfolio-grain" aria-hidden />
      <div className="portfolio-grid" aria-hidden />
      {/* Left column: chevron + ProjectNavigation on /portfolio/00 */}
      <div className="row-start-1 row-end-4 flex min-w-0 flex-col">
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="sticky top-1/2 -translate-y-1/2 flex items-center">
            <PortfolioChevronLeft />
          </div>
        </div>
        {showNavOnFallback && navItems00 && navItems00.length > 0 && (
          <div className="pb-6 pl-2 hidden lg:block" aria-label="Project index">
            <ProjectNavigation items={navItems00} activeId="00" darkBg />
          </div>
        )}
      </div>
      {/* Main content spans all 3 rows - relative so HandsBackground is contained and clipped */}
      <div className="center-col relative min-h-0 min-w-0 overflow-x-hidden col-start-2 col-end-3 row-start-1 row-end-4">
        {children}
      </div>
      {/* Right chevron, vertically centered */}
      <div className="row-start-2 row-end-3 flex justify-center">
        <div className="sticky top-1/2 -translate-y-1/2 flex items-center">
          <PortfolioChevronRight />
        </div>
      </div>
    </div>
  );
}
