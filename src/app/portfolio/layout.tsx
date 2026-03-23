"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import {
  PortfolioChevronLeft,
  PortfolioChevronRight,
} from "@/components/PortfolioChevrons";
import { PortfolioMobileMenu } from "@/components/PortfolioMobileMenu";
import { ProjectNavigation } from "@/components/ProjectNavigation";
import { getPortfolioNavItems } from "@/app/portfolio/actions";
import type { ProjectNavigationItem } from "@/components/ProjectNavigation";

const PROJECT_DETAIL_REGEX = /^\/portfolio\/projects\/\d{1,2}$/;

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProjectDetail = PROJECT_DETAIL_REGEX.test(pathname ?? "");

  const [navItems, setNavItems] = useState<
    ProjectNavigationItem[] | null | undefined
  >(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPortfolioNavItems().then((items) => {
      if (!cancelled) setNavItems(items);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMobileMenuOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const inner =
    isProjectDetail ? (
      children
    ) : (
      <>
        <PortfolioMobileMenu
          items={navItems === null ? null : navItems}
          activeId={
            pathname === "/portfolio"
              ? "cover"
              : pathname === "/portfolio/contact"
                ? "07"
                : "00"
          }
          darkTopBar={
            pathname === "/portfolio" ||
            pathname === "/portfolio/00" ||
            pathname === "/portfolio/contact"
          }
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onOpen={() => setIsMobileMenuOpen(true)}
        />

        <div className="grid grid-cols-[1fr] md:grid-cols-[4rem_1fr_4rem] grid-rows-[1fr_4rem_1fr] min-h-svh min-w-0 w-full max-w-full overflow-hidden">
          <div className="hidden md:flex row-start-1 row-end-4 min-w-0 flex-col relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <PortfolioChevronLeft />
            </div>
            {pathname === "/portfolio/00" &&
            Array.isArray(navItems) &&
            navItems.length > 0 ? (
              <div
                className="pb-10 pl-2 hidden lg:block relative z-10 mt-auto"
                aria-label="Project index"
              >
                <ProjectNavigation items={navItems} activeId="00" darkBg />
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

  return (
    <div className="min-w-0 w-full bg-[#0C1222] max-w-full overflow-x-hidden">
      <div className="portfolio-grain-sm pointer-events-none" aria-hidden />
      <div
        className="portfolio-grid-overlay opacity-80 pointer-events-none"
        aria-hidden
      />
      {inner}
      <Analytics />
    </div>
  );
}
