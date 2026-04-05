"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PortfolioChevronLeft,
  PortfolioChevronRight,
} from "@/components/PortfolioChevrons";
import { PortfolioMobileMenu } from "@/components/PortfolioMobileMenu";
import { ProjectNavigation } from "@/components/ProjectNavigation";
import type { ProjectNavigationItem } from "@/components/ProjectNavigation";

const PROJECT_DETAIL_REGEX = /^\/portfolio\/projects\/\d{1,2}$/;

export function PortfolioShell({
  children,
  navItems,
}: {
  children: React.ReactNode;
  navItems: ProjectNavigationItem[];
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

  const isCover = pathname === "/portfolio";
  const isToc = pathname === "/portfolio/00";
  const showTocNav =
    (isCover || isToc) && !(isToc && navItems.length === 0);

  const inner = isProjectDetail ? (
    children
  ) : (
    <>
      <PortfolioMobileMenu
        items={navItems}
        activeId={activeId}
        darkTopBar={darkTopBar}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpen={() => setIsMobileMenuOpen(true)}
      />

      <div className="grid grid-cols-[1fr] md:grid-cols-[4rem_1fr_4rem] grid-rows-[1fr_4rem_1fr] min-h-svh min-w-0 w-full max-w-full overflow-hidden">
        <div className="hidden md:flex row-start-1 row-end-4 min-w-0 flex-col relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <PortfolioChevronLeft />
          </div>
          {showTocNav ? (
            <div
              className="pb-10 pl-2 hidden lg:block relative z-10 mt-auto"
              aria-label="Project index"
            >
              <ProjectNavigation
                items={navItems}
                activeId={isCover ? "cover" : "00"}
                darkBg
              />
            </div>
          ) : null}
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
