import {
  findProjectByPcode,
  type StrapiProjectNode,
} from "@/lib/strapiProjects";

export type ProjectNavItem = {
  id: string;
  name: string;
  href?: string;
};

/**
 * Build nav items for project sidebar (00 = toc, 01–06 = projects, 07 = contact).
 */
export function buildProjectNavItems(
  data: StrapiProjectNode[],
): ProjectNavItem[] {
  const list: ProjectNavItem[] = [];
  list.push({ id: "00", name: "Table of contents", href: "/portfolio/00" });
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
    list.push({ id: code, name });
  }
  list.push({ id: "07", name: "Contact" });
  return list;
}
