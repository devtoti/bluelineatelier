import Image from "next/image";
import Link from "next/link";
import "../../../../projects.css";
import { notFound } from "next/navigation";
import type { Project } from "../../../../../types/project";

const PROJECT_ORDER = ["00", "1", "2", "3", "4", "5", "6", "7"] as const;

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

function getSectionLabel(code: string) {
  if (code === "00") return "Table of contents";
  if (["1", "2", "3"].includes(code)) return "Main projects";
  if (["4", "5", "6"].includes(code)) return "Complementary projects";
  if (code === "7") return "Back cover & contact";
  return "Project";
}

function mapStrapiToProject(attrs: any): Project {
  const interventionSrc = Array.isArray(attrs.intervention)
    ? attrs.intervention[0]
    : attrs.intervention;
  const siteSrc = Array.isArray(attrs.site) ? attrs.site[0] : attrs.site;
  const keyStagesSrc = Array.isArray(attrs.keyStages)
    ? attrs.keyStages[0]
    : attrs.keyStages;
  const overviewSrc = Array.isArray(attrs.overview)
    ? attrs.overview[0]
    : attrs.overview;

  const toArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [];
  };

  const collaborators =
    Array.isArray(interventionSrc?.collaborators?.data) ||
    Array.isArray(interventionSrc?.collaborators)
      ? (interventionSrc.collaborators.data ?? interventionSrc.collaborators)
          .map((c: any) => c?.attributes?.name ?? c?.name)
          .filter(Boolean)
      : [];

  return {
    pcode: attrs.pcode,
    name: attrs.name,
    summary: attrs.summary,
    description: attrs.description,
    tags: toArray(attrs.tags),

    intervention: {
      yearStarted: interventionSrc?.yearStarted,
      yearCompleted: interventionSrc?.yearCompleted,
      area: interventionSrc?.area,
      collaborators,
      styles: toArray(interventionSrc?.styles),
      materials: toArray(interventionSrc?.materials),
      usesRegionalMaterials: Boolean(interventionSrc?.usesRegionalMaterials),
      wasComputated: Boolean(interventionSrc?.wasComputated),
      wasPrototyped: Boolean(interventionSrc?.wasPrototyped),
      isRegenerative: Boolean(interventionSrc?.isRegenerative),
      isSustainable: Boolean(interventionSrc?.isSustainable),
      isAuthoredByAntonio: Boolean(interventionSrc?.isAuthoredByAntonio),
    },

    site: {
      area: siteSrc?.area,
      location: siteSrc?.location,
      country: siteSrc?.country,
      city: siteSrc?.city,
      latitude: siteSrc?.latitude,
      longitude: siteSrc?.longitude,
    },

    scale: attrs.scale,
    status: attrs.projectStatus,
    domain: attrs.domain,

    keyStages: keyStagesSrc && {
      initiation: keyStagesSrc.initiation,
      planning: keyStagesSrc.planning,
      execution: keyStagesSrc.execution,
      completion: keyStagesSrc.completion,
    },

    overview: {
      context: overviewSrc?.context ?? "",
      challenges: overviewSrc?.challenges ?? "",
      approach: overviewSrc?.approach ?? "",
      results: overviewSrc?.results ?? "",
      learnings: overviewSrc?.learnings ?? undefined,
      nextSteps: overviewSrc?.nextSteps ?? undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not defined");
  }

  const res = await fetch(
    `${baseUrl}/api/projects?filters[pcode][$eq]=${encodeURIComponent(
      id,
    )}&populate=*`,
    {
      // Keep data reasonably fresh during development
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch project ${id}`);
  }

  const { data } = await res.json();
  const projectNode = Array.isArray(data) ? data[0] : data;

  if (!projectNode) {
    return (
      <div
        className="relative min-h-[100svh] font-sans text-[#2B4673]"
        style={{ backgroundColor: "#EDE7E3" }}
      >
        <div className="portfolio-grain-light" aria-hidden />
        <div className="portfolio-grid-light" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="mb-6 text-sm uppercase tracking-widest opacity-70">
            Project not found
          </p>
          <Link
            href="/portfolio"
            className="text-sm font-medium underline underline-offset-4 hover:opacity-70"
          >
            ← Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  const attrs = projectNode.attributes ?? projectNode;
  const project = mapStrapiToProject(attrs);

  const cover =
    attrs.cover?.data?.attributes ?? attrs.image?.data?.attributes ?? null;

  const index = PROJECT_ORDER.indexOf(id as (typeof PROJECT_ORDER)[number]);
  const prevCode = index > 0 ? PROJECT_ORDER[index - 1] : null;
  const nextCode =
    index >= 0 && index < PROJECT_ORDER.length - 1
      ? PROJECT_ORDER[index + 1]
      : null;

  return (
    <div
      className="project relative min-h-[100svh] font-sans text-[#2B4673]"
      style={{ backgroundColor: "#EDE7E3" }}
    >
      <div className="portfolio-grain-light" aria-hidden />
      <div className="portfolio-grid-light" aria-hidden />

      <div className="relative z-10 mx-auto max-w-3xl">
        <article className="mt-8  bg-white/70 p-6 sm:p-8">
          <span className="bracket top-0 left-0 absolute w-5 h-5 border-t-2 border-l-2 border-blue-800 opacity-100"></span>
          <span className="bracket top-0 right-0 absolute w-5 h-5 border-t-2 border-r-2 border-blue-800 opacity-100"></span>
          <span className="bracket bottom-0 left-0 absolute w-5 h-5 border-b-2 border-l-2 border-blue-800 opacity-100"></span>
          <span className="bracket bottom-0 right-0 absolute w-5 h-5 border-b-2 border-r-2 border-blue-800 opacity-100"></span>
          {/* Masthead */}
          <header className="border-b border-zinc-300 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
              {project.domain.toUpperCase()} • {getSectionLabel(project.pcode)}
            </p>
            <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              {project.name}
            </h1>
            {project.summary && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed italic text-[#2B4673] opacity-75 sm:text-base">
                {project.summary}
              </p>
            )}
          </header>

          {/* Meta grid */}
          <section className="overview mt-6 grid gap-6 text-xs sm:grid-cols-3">
            <dl className="space-y-2">
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                  Location
                </dt>
                <dd>
                  {project.site.city}, {project.site.country}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                  Site
                </dt>
                <dd>{project.site.location}</dd>
              </div>
            </dl>

            <dl className="space-y-2">
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                  Years
                </dt>
                <dd>
                  {project.intervention.yearStarted}
                  {project.intervention.yearCompleted
                    ? ` – ${project.intervention.yearCompleted}`
                    : " – Ongoing"}
                </dd>
              </div>
              {project.intervention.area && (
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                    Area
                  </dt>
                  <dd>{project.intervention.area.toLocaleString()} m²</dd>
                </div>
              )}
            </dl>

            <dl className="space-y-2">
              {project.intervention.collaborators.length > 0 && (
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                    Collaborators
                  </dt>
                  <dd>{project.intervention.collaborators.join(", ")}</dd>
                </div>
              )}
              {project.tags.length > 0 && (
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                    Keywords
                  </dt>
                  <dd className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md border border-[#2B4673]/30 bg-[#D0D5DB] px-2.5 py-0.5 text-xs font-semibold text-[#2B4673] transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Hero image */}
          {cover?.url && (
            <figure className="mt-8 overflow-hidden rounded-lg border border-zinc-300 bg-white/60">
              <Image
                src={
                  cover.url.startsWith("http")
                    ? cover.url
                    : `${baseUrl}${cover.url}`
                }
                alt={cover.alternativeText ?? project.name}
                width={cover.width ?? 1200}
                height={cover.height ?? 800}
                className="h-auto w-full object-cover"
              />
            </figure>
          )}

          {/* Narrative sections */}
          <section className="mt-10 space-y-8 text-sm leading-relaxed sm:text-base">
            {project.overview.context && (
              <section>
                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                  Context
                </h2>
                <p className="mt-3 whitespace-pre-line">
                  {project.overview.context}
                </p>
              </section>
            )}

            {project.overview.challenges && (
              <section>
                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                  Challenges
                </h2>
                <p className="mt-3 whitespace-pre-line">
                  {project.overview.challenges}
                </p>
              </section>
            )}

            {project.overview.approach && (
              <section>
                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                  Approach
                </h2>
                <p className="mt-3 whitespace-pre-line">
                  {project.overview.approach}
                </p>
              </section>
            )}

            {project.overview.results && (
              <section>
                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                  Results
                </h2>
                <p className="mt-3 whitespace-pre-line">
                  {project.overview.results}
                </p>
              </section>
            )}

            {(project.overview.learnings || project.overview.nextSteps) && (
              <section className="grid gap-8 sm:grid-cols-2">
                {project.overview.learnings && (
                  <div>
                    <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                      Learnings
                    </h2>
                    <p className="mt-3 whitespace-pre-line">
                      {project.overview.learnings}
                    </p>
                  </div>
                )}
                {project.overview.nextSteps && (
                  <div>
                    <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                      Next steps
                    </h2>
                    <p className="mt-3 whitespace-pre-line">
                      {project.overview.nextSteps}
                    </p>
                  </div>
                )}
              </section>
            )}
          </section>

          {/* Key stages & technical flags */}
          <section className="mt-10 grid gap-8 border-t border-zinc-300 pt-6 text-xs sm:grid-cols-2">
            {project.keyStages && (
              <div>
                <h2 className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.3em] opacity-70">
                  Project timeline
                </h2>
                <ol className="mt-4 space-y-2">
                  <li>
                    <span className="font-semibold">Initiation:</span>{" "}
                    {project.keyStages.initiation}
                  </li>
                  <li>
                    <span className="font-semibold">Planning:</span>{" "}
                    {project.keyStages.planning}
                  </li>
                  <li>
                    <span className="font-semibold">Execution:</span>{" "}
                    {project.keyStages.execution}
                  </li>
                  <li>
                    <span className="font-semibold">Completion:</span>{" "}
                    {project.keyStages.completion}
                  </li>
                </ol>
              </div>
            )}

            <div>
              <h2 className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.3em] opacity-70">
                Technical profile
              </h2>
              <dl className="mt-4 space-y-1">
                <div>
                  <dt className="inline opacity-70">Scale:</dt>{" "}
                  <dd className="inline capitalize">{project.scale}</dd>
                </div>
                <div>
                  <dt className="inline opacity-70">Status:</dt>{" "}
                  <dd className="inline capitalize">{project.status}</dd>
                </div>
                <div>
                  <dt className="inline opacity-70">Regional materials:</dt>{" "}
                  <dd className="inline">
                    {project.intervention.usesRegionalMaterials ? "Yes" : "No"}
                  </dd>
                </div>
                <div>
                  <dt className="inline opacity-70">Computational tools:</dt>{" "}
                  <dd className="inline">
                    {project.intervention.wasComputated ? "Used" : "Not used"}
                  </dd>
                </div>
                <div>
                  <dt className="inline opacity-70">Prototype built:</dt>{" "}
                  <dd className="inline">
                    {project.intervention.wasPrototyped ? "Yes" : "No"}
                  </dd>
                </div>
                <div>
                  <dt className="inline opacity-70">Regenerative focus:</dt>{" "}
                  <dd className="inline">
                    {project.intervention.isRegenerative ? "Yes" : "No"}
                  </dd>
                </div>
                <div>
                  <dt className="inline opacity-70">Sustainable design:</dt>{" "}
                  <dd className="inline">
                    {project.intervention.isSustainable ? "Yes" : "No"}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {(prevCode || nextCode) && (
            <nav
              aria-label="Project navigation"
              className="mt-10 flex flex-col gap-4 border-t border-zinc-300 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="text-xs uppercase tracking-[0.25em] opacity-70">
                {getSectionLabel(id)}
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {prevCode && (
                  <Link
                    href={`/portfolio/projects/${prevCode}`}
                    className="inline-flex items-center rounded-full border border-zinc-500 px-3 py-1 text-xs font-medium transition-colors hover:border-zinc-700 hover:bg-zinc-200/60"
                  >
                    ← Previous ({getSectionLabel(prevCode)})
                  </Link>
                )}
                {nextCode && (
                  <Link
                    href={`/portfolio/projects/${nextCode}`}
                    className="inline-flex items-center rounded-full border border-zinc-500 px-3 py-1 text-xs font-medium transition-colors hover:border-zinc-700 hover:bg-zinc-200/60"
                  >
                    Next ({getSectionLabel(nextCode)}) →
                  </Link>
                )}
              </div>
            </nav>
          )}
        </article>
      </div>
    </div>
  );
}
