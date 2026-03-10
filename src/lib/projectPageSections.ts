import type { PageContentItem } from "@/components/PageContent";

function hasContent(value: unknown): boolean {
  return value != null && String(value).trim() !== "";
}

/**
 * Build "On this page" sections from project attributes (shared by page and layout).
 */
export function buildPageSections(proj: Record<string, unknown>): PageContentItem[] {
  const overview = (
    proj.overview as Record<string, unknown>[] | undefined
  )?.[0] as Record<string, unknown> | undefined;
  const keyStages = (
    proj.keyStages as Record<string, unknown>[] | undefined
  )?.[0] as Record<string, unknown> | undefined;

  const photos = (proj.photos as { name?: string; url?: string }[] | undefined) ?? [];
  const hasGallery = photos.some(
    (p) => typeof p?.url === "string" && p.url.length > 0 && !p.name?.toLowerCase().includes("thumbnail")
  );

  const sections: (PageContentItem | false)[] = [
    hasGallery && { id: "gallery", label: "Gallery" },
    hasContent(proj.description) &&
      hasContent(overview?.context) && { id: "overview", label: "Overview" },
    proj.domain === "architecture" && {
      id: "details",
      label: "Project details",
    },
    hasContent(overview?.challenges) && {
      id: "challenges",
      label: "Challenges",
    },
    hasContent(overview?.objectives) && {
      id: "objectives",
      label: "Objectives",
    },
    hasContent(overview?.approach) && { id: "approach", label: "Approach" },
    hasContent(overview?.results) && { id: "results", label: "Results" },
    keyStages ? { id: "project-timeline", label: "Project timeline" } : false,
  ];
  return sections.filter((s): s is PageContentItem => Boolean(s));
}
