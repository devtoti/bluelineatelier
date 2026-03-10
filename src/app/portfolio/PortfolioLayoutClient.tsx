"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PortfolioChevronLeft,
  PortfolioChevronRight,
} from "@/components/PortfolioChevrons";
import { ProjectNavigation } from "@/components/ProjectNavigation";
import { PageContent } from "@/components/PageContent";
import { getProjectLayoutData } from "@/app/portfolio/actions";
import type { ProjectLayoutData } from "@/app/portfolio/actions";

const PROJECT_ID_REGEX = /^\/portfolio\/projects\/(01|02|03|04|05|06)$/;

export function PortfolioLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [layoutData, setLayoutData] = useState<
    ProjectLayoutData | null | undefined
  >(undefined);

  const isProjectPage = pathname?.match(PROJECT_ID_REGEX);
  const projectId = isProjectPage ? (pathname?.split("/").pop() ?? null) : null;

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

  const showProjectGrid = isProjectPage && layoutData !== undefined;

  if (showProjectGrid && layoutData) {
    return (
      <div
        className="project relative h-svh max-h-svh font-sans text-[#2B4673] overflow-hidden"
        style={{ backgroundColor: "#EDE7E3" }}
      >
        <div className="portfolio-grain-light" aria-hidden />
        <div className="portfolio-grid-light" aria-hidden />
        <div className="relative z-10 grid grid-cols-[4rem_1fr_14rem] grid-rows-[1fr_4rem_1fr] h-full w-full  mx-auto font-sans text-[#2B4673]">
          <aside
            className="flex flex-col hidden lg:flex row-start-3 mt-auto"
            aria-label="Project index"
          >
            <div className="row-start-1 row-end-2 pb-6 pl-2">
              <ProjectNavigation
                items={layoutData.projectNavItems}
                activeId={layoutData.activeId}
              />
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
            className="hidden lg:flex flex-col h-min w-min pr-4 w-52 shrink-0 row-start-1 col-start-3 "
            aria-label="On this page"
          >
            <PageContent sections={layoutData.pageSections} />
          </aside>
          <div className="min-h-0 flex items-center justify-center row-start-2 col-start-3 row-end-3 ml-auto px-4">
            <PortfolioChevronRight />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[4rem_1fr_4rem] grid-rows-[1fr_4rem_1fr] min-h-svh w-full">
      {/* Left chevron, vertically centered */}
      <div className="row-start-2 row-end-3 flex justify-center">
        <div className="sticky top-1/2 -translate-y-1/2 flex items-center">
          <PortfolioChevronLeft />
        </div>
      </div>
      {/* Main content spans all 3 rows */}
      <div className="min-h-0 min-w-0 overflow-hidden col-start-2 col-end-3 row-start-1 row-end-4">
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
