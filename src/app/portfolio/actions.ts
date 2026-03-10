"use server";

import {
  getProjects,
  findProjectByPcode,
  type StrapiProjectNode,
} from "@/lib/strapiProjects";
import { buildProjectNavItems, type ProjectNavItem } from "@/lib/portfolioNav";
import { buildPageSections } from "@/lib/projectPageSections";
import type { PageContentItem } from "@/components/PageContent";

function normalizePcode(code: string): string {
  const n = code.replace(/^0+/, "") || "0";
  return n.length === 1 ? `0${n}` : n.padStart(2, "0");
}

export type ProjectLayoutData = {
  projectNavItems: ProjectNavItem[];
  pageSections: PageContentItem[];
  activeId: string;
};

/**
 * Fetch layout data for a project page (nav items, "On this page" sections, active id).
 * Used by the portfolio layout when rendering project pages.
 */
export async function getProjectLayoutData(
  id: string,
): Promise<ProjectLayoutData | null> {
  const normalizedId = normalizePcode(id);
  if (normalizedId === "00" || normalizedId === "07") return null;

  let data: StrapiProjectNode[] = [];
  try {
    const res = await getProjects();
    data = res.data ?? [];
  } catch {
    return null;
  }

  const altPcode = normalizedId.replace(/^0+/, "") || "0";
  const pcodeVariants = [normalizedId, altPcode].filter(
    (v, i, a) => a.indexOf(v) === i,
  );
  const projectNode = findProjectByPcode(data, pcodeVariants);
  const attrs =
    projectNode?.attributes ?? (projectNode as Record<string, unknown>);

  if (!projectNode || !attrs) return null;

  const proj = attrs as Record<string, unknown>;
  const projectNavItems = buildProjectNavItems(data);
  const pageSections = buildPageSections(proj);

  return {
    projectNavItems,
    pageSections,
    activeId: normalizedId,
  };
}

/**
 * Fetch nav items for portfolio index (e.g. route 00 / toc).
 * Used when showing ProjectNavigation on non-project portfolio routes.
 */
export async function getPortfolioNavItems(): Promise<ProjectNavItem[]> {
  try {
    const res = await getProjects();
    const data = res.data ?? [];
    return buildProjectNavItems(data);
  } catch {
    return [];
  }
}
