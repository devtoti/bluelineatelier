"use client";

import { Suspense, use, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PortfolioChevronLeft,
  PortfolioChevronRight,
} from "@/components/PortfolioChevrons";
import { PortfolioMobileMenu } from "@/components/PortfolioMobileMenu";
import { ProjectNavigation } from "@/components/ProjectNavigation";
import type { ProjectNavigationItem } from "@/components/ProjectNavigation";

const PROJECT_DETAIL_REGEX = /^\/portfolio\/projects\/\d{1,2}$/;

function StrapiNavMobileMenu({
  navItemsPromise,
  activeId,
  darkTopBar,
  isOpen,
  onClose,
  onOpen,
}: {
  navItemsPromise: Promise<ProjectNavigationItem[]>;
  activeId: string;
  darkTopBar: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}) {
  const items = use(navItemsPromise);
  return (
    <PortfolioMobileMenu
      items={items}
      activeId={activeId}
      darkTopBar={darkTopBar}
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
    />
  );
}

function StrapiNavToc({
  navItemsPromise,
  pathname,
}: {
  navItemsPromise: Promise<ProjectNavigationItem[]>;
  pathname: string;
}) {
  const navItems = use(navItemsPromise);
  if (pathname !== "/portfolio/00" || navItems.length === 0) {
    return null;
  }
  return (
    <div
      className="pb-10 pl-2 hidden lg:block relative z-10 mt-auto"
      aria-label="Project index"
    >
      <ProjectNavigation items={navItems} activeId="00" darkBg />
    </div>
  );
}

export function PortfolioShell({
  children,
  navItemsPromise,
}: {
  children: React.ReactNode;
  navItemsPromise: Promise<ProjectNavigationItem[]>;
}) {
  const pathname = usePathname();
  const isProjectDetail = PROJECT_DETAIL_REGEX.test(pathname ?? "");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMobileMenuOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const activeId =
    pathname === "/portfolio"
      ? "cover"
      : pathname === "/portfolio/contact"
        ? "07"
        : "00";

  const darkTopBar =
    pathname === "/portfolio" ||
    pathname === "/portfolio/00" ||
    pathname === "/portfolio/contact";

  const inner =
    isProjectDetail ? (
      children
    ) : (
      <>
        <Suspense
          fallback={
            <PortfolioMobileMenu
              items={undefined}
              activeId={activeId}
              darkTopBar={darkTopBar}
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              onOpen={() => setIsMobileMenuOpen(true)}
            />
          }
        >
          <StrapiNavMobileMenu
            navItemsPromise={navItemsPromise}
            activeId={activeId}
            darkTopBar={darkTopBar}
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onOpen={() => setIsMobileMenuOpen(true)}
          />
        </Suspense>

        <div className="grid grid-cols-[1fr] md:grid-cols-[4rem_1fr_4rem] grid-rows-[1fr_4rem_1fr] min-h-svh min-w-0 w-full max-w-full overflow-hidden">
          <div className="hidden md:flex row-start-1 row-end-4 min-w-0 flex-col relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <PortfolioChevronLeft />
            </div>
            <Suspense fallback={null}>
              <StrapiNavToc
                navItemsPromise={navItemsPromise}
                pathname={pathname ?? ""}
              />
            </Suspense>
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

  return <>{inner}</>;
}
