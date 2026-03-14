import { getProjects, type StrapiProjectsResponse } from "@/lib/strapiProjects";
import { TableOfContents } from "@/components/TableOfContents";
import { RetryButton } from "@/components/RetryButton";

export const dynamic = "force-dynamic";

export default async function TableOfContentsZeroPage() {
  let projectsData: StrapiProjectsResponse | null = null;
  let fetchError: Error | null = null;
  try {
    projectsData = await getProjects();
  } catch (err) {
    console.error("Strapi fetch failed:", err);
    fetchError = err instanceof Error ? err : new Error(String(err));
  }

  if (fetchError || !projectsData) {
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
            {fetchError?.message && (
              <p className="mt-2 text-xs text-zinc-500 font-mono">
                {fetchError.message}
              </p>
            )}
            <RetryButton label="Retry" className="mt-4" />
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
        <TableOfContents projects={projectsData} />
      </div>
    </div>
  );
}
