import { cacheLife } from "next/cache";
import { TableOfContents } from "@/components/TableOfContents";
import { getStrapiProjects } from "@/lib/__strapiProjects";
import Loading from "../loading";

const shellClass =
  "back-cover relative flex min-h-0 flex-1 flex-col overflow-hidden w-full font-sans";
const innerClass =
  "scrollable-project-main relative z-10 mx-auto min-h-0 flex-1 overflow-y-auto overflow-x-hidden max-w-5xl px-6 py-12";

export function TocProjectsShellFallback() {
  return (
    <div className={shellClass}>
      <Loading />
    </div>
  );
}

/** Cached Strapi list + shell — same pattern as /portfolio/projects/[id], longer TTL. */
export async function TocProjectsShell() {
  "use cache";
  cacheLife("weeks");

  const { data: projects } = await getStrapiProjects().catch((err: unknown) => {
    throw new Error(
      `Failed to load Strapi projects list: ${err instanceof Error ? err.message : String(err)}`,
    );
  });
  if (!projects?.length) {
    throw new Error(
      "Failed to load Strapi projects list: response contained no projects",
    );
  }

  return (
    <div className={shellClass}>
      <div className={innerClass}>
        <TableOfContents projects={projects} />
      </div>
    </div>
  );
}
