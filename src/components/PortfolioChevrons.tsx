"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiArrowRightWideLine } from "react-icons/ri";
import { RiArrowLeftWideLine } from "react-icons/ri";

const PORTFOLIO_SEQUENCE: {
  path: string;
  next: string | null;
  prev: string | null;
}[] = [
  { path: "/portfolio", next: "/portfolio/toc", prev: null },
  {
    path: "/portfolio/toc",
    next: "/portfolio/projects/01",
    prev: "/portfolio",
  },
  {
    path: "/portfolio/projects/01",
    next: "/portfolio/projects/02",
    prev: "/portfolio/toc",
  },
  {
    path: "/portfolio/projects/02",
    next: "/portfolio/projects/03",
    prev: "/portfolio/projects/01",
  },
  {
    path: "/portfolio/projects/03",
    next: "/portfolio/projects/04",
    prev: "/portfolio/projects/02",
  },
  {
    path: "/portfolio/projects/04",
    next: "/portfolio/projects/05",
    prev: "/portfolio/projects/03",
  },
  {
    path: "/portfolio/projects/05",
    next: "/portfolio/projects/06",
    prev: "/portfolio/projects/04",
  },
  {
    path: "/portfolio/projects/06",
    next: "/portfolio/projects/07",
    prev: "/portfolio/projects/05",
  },
  {
    path: "/portfolio/projects/07",
    next: null,
    prev: "/portfolio/projects/06",
  },
];

function getPrevNext(pathname: string): {
  prev: string | null;
  next: string | null;
} {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const entry = PORTFOLIO_SEQUENCE.find((e) => e.path === normalized);
  if (entry) return { prev: entry.prev, next: entry.next };
  // Handle dynamic [id] that might not be in list (e.g. 00)
  if (normalized.startsWith("/portfolio/projects/")) {
    const id = normalized.replace("/portfolio/projects/", "");
    const order = ["01", "02", "03", "04", "05", "06", "07"];
    const i = order.indexOf(id);
    if (i > 0)
      return {
        prev: `/portfolio/projects/${order[i - 1]}`,
        next:
          i < order.length - 1 ? `/portfolio/projects/${order[i + 1]}` : null,
      };
    if (i === 0)
      return {
        prev: "/portfolio/toc",
        next: `/portfolio/projects/${order[1]}`,
      };
    if (i === order.length - 1)
      return {
        prev: `/portfolio/projects/${order[order.length - 2]}`,
        next: null,
      };
  }
  return { prev: null, next: null };
}

const chevronLinkClass =
  "flex h-16 w-16 items-center justify-center text-[#2B4673]/50 transition-colors hover:border-[#2B4673]/70 hover:bg-black/5 hover:text-[#2B4673] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4673]/60 z-10";

/** Renders the left (previous) chevron or nothing. Place in grid col 1 for consistent coordinates. */
export function PortfolioChevronLeft() {
  const pathname = usePathname();
  const isPortfolio =
    pathname === "/portfolio" || pathname?.startsWith("/portfolio/");
  if (!isPortfolio || !pathname) return null;
  const { prev } = getPrevNext(pathname);
  if (prev == null) return <span className="w-10 h-10" aria-hidden />;
  return (
    <Link
      href={prev}
      className={chevronLinkClass}
      aria-label="Previous project"
    >
      <RiArrowLeftWideLine className="h-10 w-10" aria-hidden />
    </Link>
  );
}

/** Renders the right (next) chevron or nothing. Place in grid col 3 for consistent coordinates. */
export function PortfolioChevronRight() {
  const pathname = usePathname();
  const isPortfolio =
    pathname === "/portfolio" || pathname?.startsWith("/portfolio/");
  if (!isPortfolio || !pathname) return null;
  const { next } = getPrevNext(pathname);
  if (next == null) return <span className="w-10 h-10" aria-hidden />;
  return (
    <Link href={next} className={chevronLinkClass} aria-label="Next project">
      <RiArrowRightWideLine className="h-10 w-10" aria-hidden />
    </Link>
  );
}
