import { getNewProjects } from "@/lib/getNewProjects";
import { TocProjectsShell } from "./TocProjectsShell";

/** Must match `REVALIDATE_MS` in `@/lib/revalidate` (Next requires a literal here). */
export const revalidate = 3600;

export default async function TableOfContentsZeroPage() {
  const projects = await getNewProjects();
  const list = Array.isArray(projects.data) ? projects.data : [];

  return <TocProjectsShell initialList={list} />;
}
