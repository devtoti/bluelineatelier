"use client";

import Link from "next/link";

export type ProjectNavigationItem = {
  id: string;
  name: string;
  /** Optional href (e.g. 00 → /portfolio/toc, 07 → /portfolio/projects/07) */
  href?: string;
};

export type ProjectNavigationProps = {
  /** Ordered list of projects (e.g. 00, 01, …, 07) with names for tooltips */
  items: ProjectNavigationItem[];
  /** Current project id (e.g. "02") for active styling */
  activeId: string;
  /** Optional class for the container */
  className?: string;
};

/**
 * Vertical project index nav (e.g. 00–07). Placed bottom-left.
 * Active project is styled; hover shows a right-side tooltip with project name.
 */
export function ProjectNavigation({
  items,
  activeId,
  className = "",
}: ProjectNavigationProps) {
  const normalizedActive = activeId.replace(/^0+/, "") || "0";
  const activePcode = normalizedActive.length === 1 ? `0${normalizedActive}` : normalizedActive.padStart(2, "0");

  return (
    <nav
      aria-label="Project navigation"
      className={`project-navigation flex flex-col gap-1 ${className}`}
    >
      {items.map(({ id, name, href }) => {
        const isActive = id === activePcode;
        const linkHref = href ?? `/portfolio/projects/${id}`;
        return (
          <div key={id} className="group relative flex items-center">
            <Link
              href={linkHref}
              className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#2B4673] text-white"
                  : "text-[#2B4673]/70 hover:bg-[#2B4673]/10 hover:text-[#2B4673]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {id}
            </Link>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md border border-[#2B4673]/20 bg-[#EDE7E3] px-2.5 py-1.5 text-xs font-medium text-[#2B4673] shadow-md invisible opacity-0 transition-opacity duration-150 delay-100 group-hover:visible group-hover:opacity-100"
            >
              {name}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
