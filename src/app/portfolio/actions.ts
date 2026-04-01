"use server";

import {
  getStrapiProjects,
  findProjectByPcode,
  type StrapiProjectNode,
} from "@/lib/__strapiProjects";
import { normalizePcode } from "@/lib/__portfolioPcode";
import { buildProjectNavItems, type ProjectNavItem } from "@/lib/__portfolioNav";
import { buildPageSections } from "@/lib/__projectPageSections";
import type { PageContentItem } from "@/components/PageContent";

export type ProjectLayoutData = {
  projectNavItems: ProjectNavItem[];
  pageSections: PageContentItem[];
  activeId: string;
};

export async function getProjectLayoutData(
  id: string,
): Promise<ProjectLayoutData | null> {
  const normalizedId = normalizePcode(id);
  if (normalizedId === "00" || normalizedId === "07") return null;

  let data: StrapiProjectNode[] = [];
  try {
    const res = await getStrapiProjects();
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

export async function getPortfolioNavItems(): Promise<ProjectNavItem[]> {
  try {
    const res = await getStrapiProjects();
    const data = res.data ?? [];
    return buildProjectNavItems(data);
  } catch {
    return [];
  }
}
