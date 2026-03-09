import Link from "next/link";
import { getProjects, type StrapiProjectsResponse } from "@/lib/strapiProjects";
import { TableOfContents } from "@/components/TableOfContents";

export const dynamic = "force-dynamic";

const emptyProjects: StrapiProjectsResponse = { data: [] };

export default async function TableOfContentsPage() {
  let projectsData = emptyProjects;
  try {
    projectsData = await getProjects();
  } catch (err) {
    console.error("Strapi fetch failed:", err);
  }

  return (
    <div
      className="relative min-h-[100svh] font-sans overflow-hidden"
      style={{ backgroundColor: "#0C1222" }}
    >
      <div className="portfolio-grain" aria-hidden />
      <div className="portfolio-grid" aria-hidden />
      <div className="relative z-10 mx-auto min-h-svh max-w-5xl px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/portfolio"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            ← Back to cover page
          </Link>
        </div>
        <h1 className="font-heading text-2xl font-bold text-[#53A4D7] mb-2">
          tableOfContents<span className="text-[#BB2EB5]">(</span>
        </h1>
        <p className="text-zinc-300 text-sm mb-10">
          A collection of architectural, programming, and design projects. Click
          a card navigate to the project.
        </p>
        {projectsData.data.length === 0 && (
          <p className="text-amber-400/90 text-sm mb-6 rounded-md bg-amber-950/30 border border-amber-700/40 px-4 py-3">
            Strapi is not running. Start it with <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-800">npm run develop</kbd> in your Strapi project (e.g. <code className="text-zinc-400">localhost:1337</code>).
          </p>
        )}
        <TableOfContents projects={projectsData} />
      </div>
    </div>
  );
}
