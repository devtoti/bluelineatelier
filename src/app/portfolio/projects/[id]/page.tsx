import Link from "next/link";
import type { ReactNode } from "react";
import "../../../../projects.css";
import { notFound } from "next/navigation";
import { getStrapiMedia } from "../../../../utils/getStrapiMedia";
import { ImageCarousel } from "../../../../components/ImageCarousel";
import { ImageWithCaption } from "@/components/ImageWithCaption";
const PROJECT_ORDER = ["00", "01", "02", "03", "04", "05", "06", "07"] as const;

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

const CaptionText = ({
  title,
  text,
}: {
  title: string | undefined;
  text: string | undefined;
}) => {
  return (
    <div className="mt-3 whitespace-pre-line text-blue-700 max-w-[40ch]">
      <p className="pb-2 text-base font-bold uppercase tracking-[0.15em]">
        {title}
      </p>
      <p className="text-base font-normal">{text}</p>
    </div>
  );
};
function normalizePcode(code: string): string {
  const n = code.replace(/^0+/, "") || "0";
  return n.length === 1 ? `0${n}` : n.padStart(2, "0");
}
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not defined");
  }

  const res = await fetch(
    `${baseUrl}/api/projects?filters[pcode][$eq]=${encodeURIComponent(id)}&populate=*`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch project ${id}`);
  }

  const { data } = await res.json();
  const projectNode = Array.isArray(data) ? data[0] : data;
  const attrs =
    projectNode?.attributes ?? (projectNode as Record<string, unknown>);

  if (!projectNode || !attrs) {
    notFound();
  }

  const proj = attrs as Record<string, unknown>;

  type PhotoItem = {
    name?: string;
    url?: string;
    alt?: string;
    alternativeText?: string;
    description?: string;
    caption?: string;
  };
  const photos = proj.photos as PhotoItem[] | undefined;
  const projectName = String(proj.name ?? "Project image");
  const carouselItems = (photos ?? [])
    .filter(
      (p): p is PhotoItem & { url: string } =>
        typeof p?.url === "string" && p.url.length > 0,
    )
    .map((p) => {
      const alt = [p.alt, p.alternativeText, p.name, proj.name].find(
        (v) => typeof v === "string" && v.length > 0,
      ) as string | undefined;
      const description = [p.description, p.caption].find(
        (v) => typeof v === "string" && v.length > 0,
      ) as string | undefined;
      return {
        url: getStrapiMedia(p.url),
        alt: alt ?? projectName,
        description: description ?? alt ?? projectName,
      };
    });

  const normalizedId = normalizePcode(id);
  const index = PROJECT_ORDER.indexOf(
    normalizedId as (typeof PROJECT_ORDER)[number],
  );
  const prevCode = index > 0 ? PROJECT_ORDER[index - 1] : null;
  const nextCode =
    index >= 0 && index < PROJECT_ORDER.length - 1
      ? PROJECT_ORDER[index + 1]
      : null;

  function getSectionLabel(pcode: string): string {
    return pcode ? `Project ${pcode}` : "Project";
  }

  const tagsRaw = proj.tags;
  const tagsList: string[] = Array.isArray(tagsRaw)
    ? tagsRaw
    : typeof tagsRaw === "string"
      ? tagsRaw
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];

  const interventionData = Array.isArray(proj.intervention)
    ? (proj.intervention as Record<string, unknown>[])[0]
    : undefined;
  const collaboratorsData = interventionData?.collaborators as
    | { data?: { attributes?: { name?: string }; name?: string }[] }
    | undefined;
  const collaboratorsList = (collaboratorsData?.data ?? [])
    .map((c) => c?.attributes?.name ?? (c as { name?: string })?.name ?? "")
    .filter(Boolean);

  const site = (proj.site as Record<string, unknown>[] | undefined)?.[0] as
    | Record<string, unknown>
    | undefined;
  const overview = (
    proj.overview as Record<string, unknown>[] | undefined
  )?.[0] as Record<string, unknown> | undefined;
  const keyStages = (
    proj.keyStages as Record<string, unknown>[] | undefined
  )?.[0] as Record<string, unknown> | undefined;
  return (
    <div
      className="project relative min-h-[100svh] font-sans text-[#2B4673]"
      style={{ backgroundColor: "#EDE7E3" }}
    >
      <div className="portfolio-grain-light" aria-hidden />
      <div className="portfolio-grid-light" aria-hidden />

      <div className="relative z-10 mx-auto max-w-3xl">
        <article className="mt-8 p-6 sm:p-8">
          <span className="bracket top-0 left-0 absolute w-5 h-5 border-t-2 border-l-2 border-blue-800 opacity-100"></span>
          <span className="bracket top-0 right-0 absolute w-5 h-5 border-t-2 border-r-2 border-blue-800 opacity-100"></span>
          <span className="bracket bottom-0 left-0 absolute w-5 h-5 border-b-2 border-l-2 border-blue-800 opacity-100"></span>
          <span className="bracket bottom-0 right-0 absolute w-5 h-5 border-b-2 border-r-2 border-blue-800 opacity-100"></span>
          {/* Masthead */}
          <header className="border-b border-zinc-300 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
              {normalizedId} • {String(proj.domain ?? "").toUpperCase()} •{" "}
              {getSectionLabel(String(proj.pcode ?? id))}
            </p>
            <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              {String(proj.name ?? "")}
            </h1>
            {proj.summary != null && String(proj.summary) !== "" && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed italic text-[#2B4673] opacity-75 sm:text-base">
                {String(proj.summary)}
              </p>
            )}
            {tagsList.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {tagsList.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-[#2B4673]/30 bg-[#D0D5DB] px-4 h-6 py-2 text-xs font-semibold text-[#2B4673] transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Meta grid */}
          <section className="overview mt-6 grid gap-6 text-xs sm:grid-cols-3">
            {
              (
                <>
                  <dl className="space-y-2">
                    <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                      Location
                    </dt>
                    <dd>
                      {[
                        String(site?.city ?? ""),
                        String(site?.country ?? ""),
                      ].join(", ")}
                    </dd>
                    <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                      Site
                    </dt>
                    <dd>{String(site?.location ?? "")}</dd>
                  </dl>

                  <dl className="space-y-2">
                    <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                      Years
                    </dt>
                    <dd>
                      {String(interventionData?.yearStarted ?? "")}
                      {interventionData?.yearCompleted != null
                        ? ` – ${String(interventionData.yearCompleted)}`
                        : " – Ongoing"}
                    </dd>
                    {
                      (interventionData?.area != null ? (
                        <>
                          <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                            Area
                          </dt>
                          <dd>
                            {Number(interventionData.area).toLocaleString()} m²
                          </dd>
                        </>
                      ) : null) as ReactNode
                    }
                  </dl>

                  <dl className="space-y-2">
                    {
                      (collaboratorsList.length > 0 ? (
                        <>
                          <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                            Collaborators
                          </dt>
                          <dd>{collaboratorsList.join(", ")}</dd>
                        </>
                      ) : null) as ReactNode
                    }
                  </dl>
                </>
              ) as ReactNode
            }
          </section>
          {/* Hero image carousel */}
          {carouselItems.length > 0 && (
            <ImageCarousel
              items={carouselItems}
              width={1200}
              height={800}
              className="mt-8"
            />
          )}
          {/* Project description section */}
          {proj.description && String(proj.description).trim() !== "" && (
            <section className="mt-10">
              <p className="text-base text-blue-900 whitespace-pre-line">
                {String(proj.description)}
              </p>
            </section>
          )}

          {/* Narrative sections */}
          <section className="mt-10 space-y-8 text-sm leading-relaxed sm:text-base">
            {overview?.context != null && String(overview.context) !== "" ? (
              <CaptionText title="Context" text={String(overview.context)} />
            ) : null}

            {overview?.challenges != null &&
            String(overview.challenges) !== "" ? (
              <CaptionText
                title="Challenges"
                text={String(overview.challenges)}
              />
            ) : null}
            {/* Sketches image carousel with captions */}
            {overview?.approach != null && String(overview.approach) !== "" ? (
              <CaptionText title="Approach" text={String(overview.approach)} />
            ) : null}
            {(photos ?? []).filter(
              (p) =>
                p.url?.length &&
                p.url.length > 0 &&
                p.name?.toLowerCase()?.includes("sketches"),
            ).length > 0 && (
              <section className="mt-10">
                <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 mt-2">
                  {(photos ?? [])
                    .filter(
                      (p) =>
                        p.url?.length &&
                        p.url.length > 0 &&
                        p.name?.toLowerCase()?.includes("sketches"),
                    )
                    .map((sketch, idx) => (
                      <ImageWithCaption
                        key={sketch.url ?? idx}
                        src={getStrapiMedia(sketch.url)}
                        alt={String(
                          sketch.alt ??
                            sketch.alternativeText ??
                            sketch.name ??
                            `Sketch ${idx + 1}`,
                        )}
                        description={sketch.caption ?? sketch.description ?? ""}
                        width={1000}
                        height={700}
                      />
                    ))}
                </div>
              </section>
            )}
            {(photos ?? []).filter((p) => {
              if (!p.url?.length || p.url.length === 0 || !p.name) return false;
              const name = p.name.toLowerCase();
              return (
                name.includes("master") ||
                name.includes("floor-plan") ||
                name.includes("unit") ||
                name.includes("elevation") ||
                name.includes("section-cut") ||
                name.includes("facade-cut") ||
                name.includes("construction-detail")
              );
            }).length > 0 && (
              <section className="mt-10">
                <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 mt-2">
                  {(() => {
                    // Corrected order: floor-plan before unit, and eliminate duplicates by assigning photos only to their first matching group
                    const order = [
                      "master",
                      "floor-plan",
                      "unit",
                      "elevation",
                      "section-cut",
                      "facade-cut",
                      "construction-detail",
                    ];
                    const groupedPhotos: { [key: string]: typeof photos } = {};
                    order.forEach((label) => (groupedPhotos[label] = []));
                    (photos ?? []).forEach((p) => {
                      if (!p?.url || p.url.length === 0 || !p.name) return;
                      const name = p.name.toLowerCase();
                      for (const label of order) {
                        if (name.includes(label)) {
                          // Avoid lint error for possibly undefined:
                          (groupedPhotos[label] ?? []).push(p);
                          break; // assign only to the first matching group
                        }
                      }
                    });
                    // Flatten in order, guard for possibly undefined with || []
                    const sortedPhotos: typeof photos = [];
                    order.forEach((label) => {
                      (groupedPhotos[label] || []).forEach((photo) => {
                        sortedPhotos.push(photo);
                      });
                    });
                    return sortedPhotos.map((filteredPhoto, idx) => (
                      <ImageWithCaption
                        key={filteredPhoto.url ?? idx}
                        src={getStrapiMedia(filteredPhoto.url)}
                        alt={String(
                          filteredPhoto.alt ??
                            filteredPhoto.alternativeText ??
                            filteredPhoto.name ??
                            `Drawing ${idx + 1}`,
                        )}
                        description={
                          filteredPhoto.caption ??
                          filteredPhoto.description ??
                          ""
                        }
                        width={1200}
                        height={900}
                        figureClassName="border-blue-600"
                      />
                    ));
                  })()}
                </div>
              </section>
            )}

            {overview?.results != null && String(overview.results) !== "" ? (
              <CaptionText title="Results" text={String(overview.results)} />
            ) : null}

            {(overview?.learnings != null &&
              String(overview.learnings) !== "") ||
            (overview?.nextSteps != null &&
              String(overview.nextSteps) !== "") ? (
              <div className="grid gap-8 sm:grid-cols-2">
                {overview?.learnings != null &&
                String(overview.learnings) !== "" ? (
                  <CaptionText
                    title="Learnings"
                    text={String(overview.learnings)}
                  />
                ) : null}
                {overview?.nextSteps != null &&
                String(overview.nextSteps) !== "" ? (
                  <CaptionText
                    title="Next steps"
                    text={String(overview.nextSteps)}
                  />
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Key stages */}
          <section className="mt-10 grid gap-8 border-t border-zinc-300 pt-6 text-xs sm:grid-cols-2">
            {keyStages && (
              <div>
                <h2 className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.3em] opacity-70">
                  Project timeline
                </h2>
                <ol className="mt-4 space-y-2">
                  <li>
                    <span className="font-semibold">Initiation:</span>{" "}
                    {String(keyStages.initiation ?? "")}
                  </li>
                  <li>
                    <span className="font-semibold">Planning:</span>{" "}
                    {String(keyStages.planning ?? "")}
                  </li>
                  <li>
                    <span className="font-semibold">Execution:</span>{" "}
                    {String(keyStages.execution ?? "")}
                  </li>
                  <li>
                    <span className="font-semibold">Completion:</span>{" "}
                    {String(keyStages.completion ?? "")}
                  </li>
                </ol>
              </div>
            )}
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
