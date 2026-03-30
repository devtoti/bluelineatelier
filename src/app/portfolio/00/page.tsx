import { cacheLife } from "next/cache";
import { getNewProjects } from "@/lib/getNewProjects";
import { TocProjectsShell } from "./TocProjectsShell";

export default async function TableOfContentsZeroPage() {
  "use cache";
  cacheLife("max");

  const projects = await getNewProjects();
  const list = Array.isArray(projects.data) ? projects.data : [];

  return <TocProjectsShell initialList={list} />;
}
