import { fetchStrapiProjects } from "@/lib/__fetchStrapiProjects";
import { TocProjectsShell } from "./TocProjectsShell";


export default async function TableOfContentsZeroPage() {
  const { data } = await fetchStrapiProjects();

  return <TocProjectsShell projects={data} />;
}
