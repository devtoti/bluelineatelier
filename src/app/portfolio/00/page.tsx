import { getNewProjects } from "@/lib/getNewProjects";
import { TocProjectsShell } from "./TocProjectsShell";

export default async function TableOfContentsZeroPage() {
  const projects = await getNewProjects();
  const list = Array.isArray(projects.data) ? projects.data : [];

  return <TocProjectsShell initialList={list} />;
}
