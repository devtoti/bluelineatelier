import "../../../../projects.css";
import { notFound, redirect } from "next/navigation";
import {
  fetchStrapiProjects,
  getStrapiProjects,
  findProjectByPcode,
  strapiProjectPcodeSlug,
} from "@/lib/__strapiProjects";
import { ProjectLayout } from "@/app/portfolio/ProjectLayout";
import { buildProjectNavItems } from "@/lib/__portfolioNav";
import { buildPageSections } from "@/lib/__projectPageSections";
import {
  normalizePcode,
  enforcePortfolioStaticParams,
} from "@/lib/__portfolioPcode";
import { buildProjectPageData } from "./buildProjectPageData";
import { ProjectDetailContent } from "./ProjectDetailContent";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const strict = enforcePortfolioStaticParams();

  try {
    const res = await fetchStrapiProjects();
    const data = res.data;
    const params = data
      .map((node) => {
        const pcode = strapiProjectPcodeSlug(node);
        const n = Number.parseInt(pcode, 10);
        if (Number.isNaN(n) || n < 1 || n > 99) return null;
        return { id: pcode };
      })
      .filter((x): x is { id: string } => x != null);

    if (strict && params.length === 0) {
      throw new Error(
        "[portfolio] No projects with pcode 1–99; fix Strapi data or filters before shipping",
      );
    }

    return params;
  } catch (error) {
    if (strict) {
      throw error;
    }
    throw new Error(
      `[generateStaticParams] /portfolio/projects/[id] failed to load project list from Strapi: ${String(error)}`,
    );
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const normalizedId = normalizePcode(id);

  if (normalizedId === "00") {
    redirect("/portfolio/00");
  }

  if (normalizedId === "07") {
    redirect("/portfolio/contact");
  }

  const altPcode = normalizedId.replace(/^0+/, "") || "0";
  const pcodeVariants = [normalizedId, altPcode].filter(
    (v, i, a) => a.indexOf(v) === i,
  );

  const projectsResponse = await getStrapiProjects().catch((err: unknown) => {
    throw new Error(
      `Failed to load Strapi projects list: ${err instanceof Error ? err.message : String(err)}`,
    );
  });
  if (!projectsResponse.data?.length) {
    throw new Error(
      "Failed to load Strapi projects list: response contained no projects",
    );
  }
  const listResData = projectsResponse.data;

  const projectNode = findProjectByPcode(listResData, pcodeVariants);
  const attrs =
    projectNode?.attributes ?? (projectNode as Record<string, unknown>);

  if (!projectNode || !attrs) {
    notFound();
  }

  if (id !== normalizedId) {
    redirect(`/portfolio/projects/${normalizedId}`);
  }

  const proj = attrs as Record<string, unknown>;
  const pageData = buildProjectPageData(proj);

  return (
    <ProjectLayout
      navItems={buildProjectNavItems(listResData)}
      pageSections={buildPageSections(proj)}
      activeId={normalizedId}
    >
      <ProjectDetailContent normalizedId={normalizedId} proj={proj} {...pageData} />
    </ProjectLayout>
  );
}
