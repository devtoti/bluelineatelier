import type { PortfolioNavItem } from "./__portfolioNav";

function normalizePath(pathname: string): string {
  return pathname.replace(/\/$/, "") || "/";
}

/** Resolve nav index for the current URL (handles /projects/1 vs /projects/01). */
export function portfolioNavIndexForPathname(
  pathname: string | null,
  nav: PortfolioNavItem[],
): number {
  if (!pathname || nav.length === 0) return -1;
  const path = normalizePath(pathname);
  const direct = nav.findIndex((item) => item.href === path);
  if (direct !== -1) return direct;

  const m = /^\/portfolio\/projects\/(\d+)$/.exec(path);
  if (!m) return -1;
  const n = Number.parseInt(m[1], 10);
  if (Number.isNaN(n) || n < 1 || n > 99) return -1;
  const pcode = n < 10 ? `0${n}` : String(n);
  const href = `/portfolio/projects/${pcode}`;
  return nav.findIndex((item) => item.href === href);
}

export function activeNavIdFromPathname(
  pathname: string | null,
  nav: PortfolioNavItem[],
): string {
  const i = portfolioNavIndexForPathname(pathname, nav);
  return i === -1 ? "cover" : nav[i]!.id;
}

/** Prev/next hrefs follow the order returned by `buildProjectNavigation`. */
export function flowNeighborsFromPathname(
  pathname: string | null,
  nav: PortfolioNavItem[],
): { prev: string | null; next: string | null } {
  const i = portfolioNavIndexForPathname(pathname, nav);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? nav[i - 1]!.href : null,
    next: i < nav.length - 1 ? nav[i + 1]!.href : null,
  };
}
