"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PortfolioChevronLeft,
  PortfolioChevronRight,
} from "@/components/PortfolioChevrons";
import { ProjectNavigation } from "@/components/ProjectNavigation";
import { PageContent } from "@/components/PageContent";
import { PortfolioMobileMenu } from "@/components/PortfolioMobileMenu";
import {
  getProjectLayoutData,
  getPortfolioNavItems,
} from "@/app/portfolio/actions";
import type { ProjectLayoutData } from "@/app/portfolio/actions";
import type { ProjectNavigationItem } from "@/components/ProjectNavigation";
const PROJECT_ID_REGEX = /^\/portfolio\/projects\/(\d{1,2})$/;
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
  const [navItems00, setNavItems00] = useState<
    ProjectNavigationItem[] | null | undefined
  >(undefined);

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
    const shouldLoadNav =
      isRoute00 ||
      pathname === "/portfolio" ||
      pathname === "/portfolio/contact";

    if (!shouldLoadNav) {
      const id = requestAnimationFrame(() => setNavItems00(null));
      return () => cancelAnimationFrame(id);
    }

    const loadingFrame = requestAnimationFrame(() => setNavItems00(undefined));
    let cancelled = false;
    getPortfolioNavItems().then((items) => {
      if (!cancelled) setNavItems00(items);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(loadingFrame);
    };
  }, [isRoute00, pathname]);

  const showNavOnFallback =
    isRoute00 && Array.isArray(navItems00) && navItems00.length > 0;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  const isCoverOrContact =
    pathname === "/portfolio" ||
    pathname === "/portfolio/00" ||
    pathname === "/portfolio/contact";

  if (isProjectPage) {
    const navItems =
      layoutData === undefined
        ? undefined
        : (layoutData?.projectNavItems ?? []);
    const pageSections = layoutData?.pageSections ?? [];
    const activeId = layoutData?.activeId ?? projectId ?? "";

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
          className="project relative h-svh max-h-svh font-sans text-[#2B4673] overflow-hidden"
          style={{ backgroundColor: "#EDE7E3" }}
        >
          <div className="portfolio-grain-light" aria-hidden />
          <div className="portfolio-grid-light" aria-hidden />
          <div className="relative z-10 grid grid-cols-[1fr] md:grid-cols-[4rem_1fr_4rem] grid-rows-[1fr_4rem_1fr] h-full w-full max-w-svw overflow-y-hidden mx-auto font-sans text-[#2B4673]">
            <aside
              className="hidden lg:flex flex-col row-start-3 mt-auto"
              aria-label="Project index"
            >
              <div className="row-start-1 row-end-2 pb-6 pl-2">
                {Array.isArray(navItems) && navItems.length > 0 ? (
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
              className="scrollable-project-main min-h-0 sm:pt-0 row-start-1 -row-end-1 overflow-y-auto overflow-x-hidden scroll-smooth md:py-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2B4673]/40 col-start-1 col-end-2 md:col-start-2 md:col-end-3 row-start-1 row-end-4"
              role="region"
              aria-label="Project content"
              tabIndex={0}
            >
              {children}
            </main>

            <aside
              className="hidden relative lg:flex flex-col h-min w-min pr-4 w-52 shrink-0 row-start-1 col-start-3"
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

  const coverContactActiveId =
    pathname === "/portfolio"
      ? "cover"
      : pathname === "/portfolio/contact"
        ? "07"
        : "00";
  return (
    <>
      <PortfolioMobileMenu
        items={navItems00 === null ? null : navItems00}
        activeId={coverContactActiveId}
        darkTopBar={isCoverOrContact}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpen={() => setIsMobileMenuOpen(true)}
      />

      <div
        className="grid grid-cols-[1fr] md:grid-cols-[4rem_1fr_4rem] grid-rows-[1fr_4rem_1fr] min-h-svh min-w-0 w-full max-w-full overflow-hidden"
        style={{ backgroundColor: "#0C1222" }}
      >
        <div className="portfolio-grain" aria-hidden />
        <div className="portfolio-grid" aria-hidden />
        <div className="hidden md:flex row-start-1 row-end-4 min-w-0 flex-col relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <PortfolioChevronLeft />
          </div>
          {showNavOnFallback && navItems00 && navItems00.length > 0 && (
            <div
              className="test pb-10 pl-2 hidden lg:block relative z-10 mt-auto"
              aria-label="Project index"
            >
              <ProjectNavigation items={navItems00} activeId="00" darkBg />
            </div>
          )}
        </div>
        <div className="center-col relative min-h-0 min-w-0 overflow-x-hidden col-start-1 col-end-2 md:col-start-2 md:col-end-3 row-start-1 row-end-4">
          {children}
        </div>
        <div className="hidden md:flex row-start-2 row-end-3 justify-center">
          <PortfolioChevronRight />
        </div>
      </div>
    </>
  );
}
