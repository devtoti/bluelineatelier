"use client";

import Link from "next/link";
import { FiMenu, FiX, FiDownload } from "react-icons/fi";
import type { ProjectNavigationItem } from "@/components/ProjectNavigation";

const ARCHITECT_CV_URL = "/docs/antonio-ruiz-architect-cv.pdf";
const FRONTEND_CV_URL = "/docs/antonio-ruiz-frontend-cv.pdf";

export type PortfolioMobileMenuProps = {
  items: ProjectNavigationItem[];
  activeId: string;
  darkTopBar?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export function PortfolioMobileMenu({
  items,
  activeId,
  darkTopBar = false,
  isOpen,
  onClose,
  onOpen,
}: PortfolioMobileMenuProps) {
  const normalizedActive = activeId.replace(/^0+/, "") || "0";
  const activePcode =
    normalizedActive.length === 1
      ? `0${normalizedActive}`
      : normalizedActive.padStart(2, "0");
  const linkBase =
    "flex h-9 w-full items-center gap-2  px-3 py-2 text-left text-sm font-medium transition-colors";
  const linkActive = "bg-white/10 text-white";
  const linkInactive =
    "text-zinc-400 hover:bg-white/5 hover:text-white focus-visible:bg-white/15 focus-visible:text-white";

  const mobileNavEntry = (
    key: string,
    label: string,
    name: string,
    href: string,
    isActive: boolean,
  ) => (
    <Link
      key={key}
      href={href}
      onClick={onClose}
      className={`${linkBase} ${isActive ? linkActive : linkInactive}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="font-heading flex h-9 w-9 shrink-0 items-center justify-center  text-lg font-medium text-zinc-300">
        {label}
      </span>
      <span className="text-md text-zinc-400">{name}</span>
    </Link>
  );

  const topBarClass = darkTopBar
    ? "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/80 focus-visible:ring-zinc-400"
    : "text-[#2B4673] hover:border-zinc-400 hover:bg-zinc-900 focus-visible:ring-[#2B4673]";

  return (
    <>
      {/* Mobile top navbar */}
      <div className="top-navbar-mboile bg-white fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-2 md:hidden">
        <div className="portfolio-grain-light" aria-hidden />
        <div className="portfolio-grid-light" aria-hidden />
        <button
          type="button"
          onClick={onOpen}
          className={`hamburger-mobile inline-flex items-center gap-2 py-1.5 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${topBarClass}`}
          aria-label="Open navigation menu"
        >
          <FiMenu className="h-4 w-4" />
          <span>Menu</span>
        </button>
        <a
          href="/docs/antonio-ruiz-portfolio-architecture.pdf"
          download
          className={`download-resume inline-flex items-center gap-2 rounded-sm py-1.5 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${topBarClass}`}
          aria-label="Download portfolio PDF"
        >
          <FiDownload className="h-4 w-4" />
          <span>PDF</span>
        </a>
      </div>

      {/* Mobile menu overlay: cover-style dark blue + squared grid */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#0C1222] bg-black/50 md:hidden">
          <div className="portfolio-grid-overlay" aria-hidden />
          <div className="relative z-10 flex flex-col h-full">
            <div className="button absolute top-3 right-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center border border-white/30 bg-white/5 p-2 text-zinc-300 shadow-md hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1222]"
                aria-label="Close navigation menu"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="floating-nav absolute inset-x-4 top-16  border border-white/30 bg-[#0C1222] p-8 shadow-xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {"// antonio ruiz - portfolio 2026"}
              </span>
              <nav
                aria-label="Project navigation"
                className="flex flex-col gap-1"
              >
                {mobileNavEntry(
                  "cover",
                  "CR",
                  "Cover",
                  "/portfolio",
                  activeId === "cover",
                )}
                {items
                  .filter(({ id }) => id === "00")
                  .map(({ id, name, href }) => {
                    const linkHref = href ?? "/portfolio/00";
                    const isActive = id === activePcode || activeId === id;
                    return mobileNavEntry(
                      "00",
                      "00",
                      name || "Table of contents",
                      linkHref,
                      isActive,
                    );
                  })}
                <div className="border border-dashed border-[#53A4D7] py-2 my-2 px-2 space-y-4">
                  {items
                    .filter(({ id }) =>
                      ["01", "02", "03", "04", "05", "06"].includes(id),
                    )
                    .map(({ id, name, href }) => {
                      const isActive = id === activePcode || activeId === id;
                      const linkHref = href ?? `/portfolio/projects/${id}`;
                      return mobileNavEntry(id, id, name, linkHref, isActive);
                    })}
                </div>
                {mobileNavEntry(
                  "07",
                  "CT",
                  "Contact",
                  "/portfolio/contact",
                  activeId === "07",
                )}
              </nav>
              <div className="mt-4 pt-4 border-t border-white/20 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {"// resumé"}
                </span>
                <div className="flex flex-row gap-4 w-full">
                  <a
                    href={ARCHITECT_CV_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center gap-2  border border-white/30 bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 w-full justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-zinc-400 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    >
                      <path
                        d="M10 14V3M10 14l-4-4m4 4l4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="4"
                        y="15"
                        width="12"
                        height="2"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                    Architecture Resume
                  </a>
                  <a
                    href={FRONTEND_CV_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center gap-2 border border-white/30 bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 w-full justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-zinc-400 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    >
                      <path
                        d="M10 14V3M10 14l-4-4m4 4l4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="4"
                        y="15"
                        width="12"
                        height="2"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                    Development Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
