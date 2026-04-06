import {
  findProjectByPcode,
  type StrapiProjectNode,
} from "@/lib/__strapiProjectsCore";

/** Row in portfolio order: cover → TOC → projects 01–06 → contact. */
export type PortfolioNavItem = {
  id: string;
  name: string;
  href: string;
  /** Short button text (e.g. CR, 00, 01, CT). */
  label: string;
  /** Mobile menu grouping only. */
  group: "intro" | "projects" | "outro";
};

const INTRO: Omit<PortfolioNavItem, "name">[] = [
  {
    id: "cover",
    label: "CR",
    href: "/portfolio",
    group: "intro",
  },
  {
    id: "00",
    label: "00",
    href: "/portfolio/00",
    group: "intro",
  },
];

const OUTRO: Omit<PortfolioNavItem, "name">[] = [
  {
    id: "07",
    label: "CT",
    href: "/portfolio/contact",
    group: "outro",
  },
];

/**
 * Single source of truth for portfolio sidebar, mobile menu, and flow (prev/next).
 * Project titles 01–06 come from Strapi; routes and order are fixed here.
 */
export function buildProjectNavigation(
  data: StrapiProjectNode[],
): PortfolioNavItem[] {
  const projects: PortfolioNavItem[] = [];
  for (let i = 1; i <= 6; i++) {
    const code = i < 10 ? `0${i}` : String(i);
    const node = findProjectByPcode(data, [code]);
    const attrs = (node?.attributes ?? node) as
      | Record<string, unknown>
      | undefined;
    const name = attrs
      ? String(attrs.name ?? attrs.title ?? `Project ${code}`).trim() ||
        `Project ${code}`
      : `Project ${code}`;
    projects.push({
      id: code,
      label: code,
      name,
      href: `/portfolio/projects/${code}`,
      group: "projects",
    });
  }

  return [
    { ...INTRO[0]!, name: "Cover" },
    { ...INTRO[1]!, name: "Table of contents" },
    ...projects,
    { ...OUTRO[0]!, name: "Contact" },
  ];
}

export function navItemIsActive(
  item: PortfolioNavItem,
  activeId: string,
): boolean {
  if (item.id === activeId) return true;
  const normalizedActive = activeId.replace(/^0+/, "") || "0";
  const activePcode =
    normalizedActive.length === 1
      ? `0${normalizedActive}`
      : normalizedActive.padStart(2, "0");
  return item.id === activePcode;
}
