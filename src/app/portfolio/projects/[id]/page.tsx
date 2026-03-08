import Link from "next/link";
import type { ReactNode } from "react";
import "../../../../projects.css";
import { notFound, redirect } from "next/navigation";
import { getStrapiMedia } from "../../../../utils/getStrapiMedia";
import { RenderPhotos } from "@/components/RenderPhotos";
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
    <div className="mt-3 whitespace-pre-line text-[#2B4673]">
      <p className="pb-2 text-base font-bold uppercase tracking-[0.15em]">
        {title}
      </p>
      <p className="text-base font-normal">{text}</p>
    </div>
  );
};

function hasContent(value: unknown): boolean {
  return value != null && String(value).trim() !== "";
}

function When({
  ok,
  children,
}: {
  ok: boolean;
  children: ReactNode;
}): ReactNode {
  if (!ok) return null;
  return <>{children}</>;
}

function ShowWhenText({
  value,
  children,
}: {
  value: unknown;
  children: (text: string) => ReactNode;
}): ReactNode {
  if (!hasContent(value)) return null;
  return <>{children(String(value).trim())}</>;
}

function normalizePcode(code: string): string {
  const n = code.replace(/^0+/, "") || "0";
  return n.length === 1 ? `0${n}` : n.padStart(2, "0");
}
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const normalizedId = normalizePcode(id);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not defined");
  }

  const altPcode = normalizedId.replace(/^0+/, "") || "0";
  const pcodeVariants = [normalizedId, altPcode].filter(
    (v, i, a) => a.indexOf(v) === i,
  );
  const filterQuery = pcodeVariants
    .map((v, i) => `filters[pcode][$in][${i}]=${encodeURIComponent(v)}`)
    .join("&");
  const res = await fetch(`${baseUrl}/api/projects?${filterQuery}&populate=*`, {
    next: { revalidate: 60 },
  });

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

  if (id !== normalizedId) {
    redirect(`/portfolio/projects/${normalizedId}`);
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

  const CAROUSEL_PRIORITY: [string, number][] = [
    ["cover", 0],
    ["render", 1],
    ["master", 2],
    ["floor-plan", 3],
    ["section-cut", 4],
    ["facade-cut", 5],
    ["construction-detail", 6],
  ];
  function carouselPriority(name: string | undefined): number {
    if (typeof name !== "string") return 99;
    const lower = name.toLowerCase();
    if (lower.includes("thumbnail") || /sketch/i.test(lower)) return -1;
    for (const [key, order] of CAROUSEL_PRIORITY) {
      if (lower.includes(key)) return order;
    }
    return 99;
  }

  const carouselItems = (photos ?? [])
    .filter(
      (p): p is PhotoItem & { url: string } =>
        typeof p?.url === "string" && p.url.length > 0,
    )
    .filter((p) => carouselPriority(p.name) >= 0)
    .sort((a, b) => carouselPriority(a.name) - carouselPriority(b.name))
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
              {normalizedId} • {String(proj.domain ?? "").toUpperCase()}
              {/* {getSectionLabel(String(proj.pcode ?? id))} */}
            </p>
            <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              {String(proj.name ?? "")}
            </h1>
            {proj.summary != null && String(proj.summary) !== "" && (
              <p className="mt-2 mb-4 max-w-2xl text-sm leading-relaxed italic text-[#2B4673] opacity-75 sm:text-base">
                {String(proj.summary)}
              </p>
            )}
            {tagsList.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {String(tagsRaw ?? "")
                    .split("\n")
                    .map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-[#2B4673]/30 bg-gray-200  italic px-4 h-7 py-2 text-xs font-semibold text-[#2B4673] transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </header>

          {/* Hero image carousel */}
          {carouselItems.length > 0 && (
            <ImageCarousel
              items={carouselItems}
              width={1200}
              height={800}
              className="mt-8"
            />
          )}
          {/* Meta grid */}
          {proj.domain === "architecture" && (
            <section className="overview mt-8 bg-black/5 py-4 px-2 grid gap-6 text-xs sm:grid-cols-3">
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
                  {interventionData?.area != null ? (
                    <>
                      <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                        Area
                      </dt>
                      <dd>
                        {Number(interventionData.area).toLocaleString()} m²
                      </dd>
                    </>
                  ) : null}
                </dl>

                <dl className="space-y-2">
                  {collaboratorsList.length > 0 ? (
                    <>
                      <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                        Collaborators
                      </dt>
                      <dd>{collaboratorsList.join(", ")}</dd>
                    </>
                  ) : null}
                </dl>
              </>
            </section>
          )}
          {/* Project description section */}
          <section className="mt-10">
            <When
              ok={hasContent(proj.description) && hasContent(overview?.context)}
            >
              <CaptionText title="Overview" text={String(proj.description)} />
              <br />
              <CaptionText title="" text={String(overview?.context)} />
            </When>
          </section>

          {/* Narrative sections */}
          <section className="mt-10 space-y-8 text-sm leading-relaxed sm:text-base">
            <ShowWhenText value={overview?.challenges}>
              {(text) => <CaptionText title="Challenges" text={text} />}
            </ShowWhenText>
            <ShowWhenText value={overview?.objectives}>
              {(text) => <CaptionText title="Objectives" text={text} />}
            </ShowWhenText>
            <ShowWhenText value={overview?.approach}>
              {(text) => <CaptionText title="Approach" text={text} />}
            </ShowWhenText>

            <RenderPhotos
              photos={photos}
              nameContains="master"
              altFallback="Master Plan Drawing"
            />

            {(photos ?? []).filter(
              (p) =>
                p.url?.length &&
                p.url.length > 0 &&
                p.name?.toLowerCase()?.includes("sketches"),
            ).length > 0 && (
              <section className="mt-10">
                <div className="grid gap-4 grid-cols-5 lg:grid-cols-3 mt-2">
                  {(photos ?? [])
                    .filter(
                      (p) =>
                        p.url?.length &&
                        p.url.length > 0 &&
                        p.name?.toLowerCase()?.includes("sketches"),
                    )
                    .map((sketch, idx) => (
                      <div key={sketch.url ?? idx}>
                        <ImageWithCaption
                          src={getStrapiMedia(sketch.url)}
                          alt={String(
                            sketch.alt ??
                              sketch.alternativeText ??
                              sketch.name ??
                              `Sketch ${idx + 1}`,
                          )}
                          description=""
                          width={700}
                          height={500}
                          className="w-full h-auto"
                        />
                        <p className="text-xs text-[#2B4673]">
                          {sketch.caption ?? ""}
                        </p>
                      </div>
                    ))}
                </div>
              </section>
            )}
            <RenderPhotos
              photos={photos}
              nameContains="floor-plan"
              title="Floor Plans"
              altFallback="Floor Plan Drawing"
            />
            {/* <RenderPhotos
              photos={photos}
              nameContains="unit"
              title="Units"
              altFallback="Unit Drawing"
            /> */}
            <RenderPhotos
              photos={photos}
              nameContains="elevation"
              title="Elevations"
              altFallback="Elevation Drawing"
            />
            <RenderPhotos
              photos={photos}
              nameContains="section-cut"
              title="Section Cuts"
              altFallback="Section Cut Drawing"
            />
            <RenderPhotos
              photos={photos}
              nameContains="facade-cut"
              title="Facade Cuts"
              altFallback="Facade Cut Drawing"
            />
            <RenderPhotos
              photos={photos}
              nameContains="construction-detail"
              title="Construction Details"
              altFallback="Construction Detail Drawing"
            />

            <ShowWhenText value={overview?.results}>
              {(text) => <CaptionText title="Results" text={text} />}
            </ShowWhenText>

            <When
              ok={
                hasContent(overview?.learnings) ||
                hasContent(overview?.nextSteps)
              }
            >
              <div className="grid gap-8 sm:grid-cols-2">
                <ShowWhenText value={overview?.learnings}>
                  {(text) => <CaptionText title="Learnings" text={text} />}
                </ShowWhenText>
                <ShowWhenText value={overview?.nextSteps}>
                  {(text) => <CaptionText title="Next steps" text={text} />}
                </ShowWhenText>
              </div>
            </When>
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
