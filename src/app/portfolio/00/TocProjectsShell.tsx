import { TableOfContents } from "@/components/TableOfContents";
import type { StrapiProjectNode } from "@/lib/__strapiProjects";

const shellClass =
  "back-cover relative min-h-[100svh] w-full font-sans overflow-hidden";
const innerClass = "relative z-10 mx-auto min-h-svh max-w-5xl px-6 py-12";

export function TocProjectsShell({
  projects,
}: {
  projects: StrapiProjectNode[];
}) {
  return (
    <div className={shellClass}>
      <div className={innerClass}>
        <TableOfContents projects={projects} />
      </div>
    </div>
  );
}
