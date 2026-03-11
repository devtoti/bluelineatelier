import { getProjects, type StrapiProjectsResponse } from "@/lib/strapiProjects";
import { TableOfContents } from "@/components/TableOfContents";

export const dynamic = "force-dynamic";

const emptyProjects: StrapiProjectsResponse = { data: [] };

export default async function TableOfContentsZeroPage() {
  let projectsData = emptyProjects;
  try {
    projectsData = await getProjects();
  } catch (err) {
    console.error("Strapi fetch failed:", err);
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
          A collection of architectural, programming, and design projects. Click
          a card navigate to the project.
        </p>
        <TableOfContents projects={projectsData} />
      </div>
    </div>
  );
}
