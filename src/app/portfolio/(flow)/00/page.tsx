import "../../../../projects.css";
import { getStrapiProjects } from "@/lib/__strapiProjects";
import { buildProjectNavigation } from "@/lib/__portfolioNav";
import { TocProjectsShell } from "./TocProjectsShell";
import { TocChrome } from "./TocChrome";

export default async function TableOfContentsZeroPage() {
  const { data } = await getStrapiProjects();
  const navigation = buildProjectNavigation(data);

  return (
    <TocChrome navigation={navigation}>
      <div className="box-border flex h-[100svh] max-h-[100svh] min-h-0 w-full flex-col overflow-hidden">
        <TocProjectsShell />
      </div>
    </TocChrome>
  );
}
