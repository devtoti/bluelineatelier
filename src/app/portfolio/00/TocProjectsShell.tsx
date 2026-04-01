import { TableOfContents } from "@/components/TableOfContents";
import type { StrapiProjectNode } from "@/lib/__strapiProjects";

const shellClass =
  "back-cover relative flex min-h-0 flex-1 flex-col overflow-hidden w-full font-sans";
const innerClass =
  "relative z-10 mx-auto min-h-0 flex-1 overflow-y-auto overflow-x-hidden max-w-5xl px-6 py-12";

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
