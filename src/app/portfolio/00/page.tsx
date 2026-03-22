import { TableOfContents } from "@/components/TableOfContents";
import { RetryButton } from "@/components/RetryButton";
import {
  getProjects,
  type StrapiProjectNode,
} from "@/lib/strapiProjects";

export const revalidate = 3600;

export default async function TableOfContentsZeroPage() {
  let projects: StrapiProjectNode[];

  try {
    const response = await getProjects();
    projects = response.data ?? [];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    projects = [];
  }

  if (projects.length === 0) {
    return (
      <div className="back-cover relative min-h-[100svh] w-full font-sans overflow-hidden">
        <div className="relative z-10 mx-auto min-h-svh max-w-5xl px-6 py-12">
          <h1
            className="font-heading text-xl lg:text-3xl font-bold mb-2"
            style={{ color: "#53A4D7" }}
          >
            tableOfContents
            <span style={{ color: "#BB2EB5" }}>( )</span>
          </h1>
          <div className="rounded border border-amber-500/50 bg-amber-950/20 p-4 text-amber-200">
            <p className="font-medium">Projects could not be loaded</p>
            <p className="mt-1 text-sm text-zinc-400">
              Strapi may be temporarily unavailable (e.g. 503). Please try again
              in a moment.
            </p>
            <div className="mt-4 flex flex-row gap-3">
              <div className="flex-1">
                <RetryButton
                  hardReload
                  label="Refresh Page"
                  className="w-full rounded border border-zinc-500 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-800 text-center disabled:opacity-60"
                />
              </div>
              <div className="flex-1">
                <a
                  href="/docs/antonio-ruiz-portfolio-architecture.pdf"
                  className="block w-full rounded border border-zinc-500 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-800 text-center"
                  download
                >
                  View PDF Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="back-cover relative min-h-[100svh] w-full font-sans overflow-hidden">
      <div className="relative z-10 mx-auto min-h-svh max-w-5xl px-6 py-12">
        <h1
          className="font-heading text-xl lg:text-3xl font-bold mb-2"
          style={{ color: "#53A4D7" }}
        >
          tableOfContents
          <span style={{ color: "#BB2EB5" }}>( )</span>
        </h1>
        <p className="text-zinc-300 text-sm mb-10">
          {
            "// A collection of architectural, programming, and design projects."
          }
        </p>
        <TableOfContents projects={{ data: projects as StrapiProjectNode[] }} />
      </div>
    </div>
  );
}
