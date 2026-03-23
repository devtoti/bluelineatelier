import { getNewProjects } from "@/lib/getNewProjects";
import { TocProjectsShell } from "./TocProjectsShell";

/** Static portfolio TOC — aligned with `/portfolio/projects/[id]` Strapi cache. */
export const revalidate = false;

export default async function TableOfContentsZeroPage() {
  const projects = await getNewProjects();
  const list = Array.isArray(projects.data) ? projects.data : [];

  return <TocProjectsShell initialList={list} />;
}
