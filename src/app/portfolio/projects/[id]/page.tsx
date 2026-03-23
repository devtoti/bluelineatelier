import type { ReactNode } from "react";
import "../../../../projects.css";
import { notFound, redirect } from "next/navigation";
import { getStrapiMedia } from "../../../../utils/getStrapiMedia";
import { DetailsAccordion } from "@/components/DetailsAccordion";
import { OpenInMapsButton } from "@/components/OpenInMapsButton";
import { ProjectMobileNav } from "@/components/ProjectMobileNav";
import { RenderPhotos } from "@/components/RenderPhotos";
import { ImageCarousel } from "../../../../components/ImageCarousel";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import { RetryButton } from "@/components/RetryButton";

import {
  findProjectByPcode,
  strapiProjectPcodeSlug,
  type StrapiProjectNode,
} from "@/lib/__strapiProjects";
import {
  fetchStrapiProjectByPcode,
  fetchStrapiProjects,
  fetchStrapiProjectsStrict,
} from "@/lib/__fetchStrapiProjects";
import { ProjectLayout } from "@/app/portfolio/ProjectLayout";
import { buildProjectNavItems } from "@/lib/__portfolioNav";
import { buildPageSections } from "@/lib/__projectPageSections";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

const CaptionText = ({
  title,
  text,
  className = "",
  titleClassName = "",
  textClassName = "",
}: {
  title: string | undefined;
  text: string | undefined;
  className?: string;
  titleClassName?: string;
  textClassName?: string;
}) => {
  return (
    <div className={`mt-3 whitespace-pre-line text-[#2B4673] ${className}`}>
      <p
        className={`pb-2 text-base font-bold uppercase tracking-[0.15em] ${titleClassName}`}
      >
        {title}
      </p>
      <p className={`text-base font-normal ${textClassName}`}>{text}</p>
    </div>
  );
};

const EntryText = ({
  title,
  text,
  children,
  className = "",
}: {
  title: string | undefined;
  text: string | undefined;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <dl className={`entry text-[#2B4673] ${className}`}>
      <p className="text-[#2B4673] font-bold uppercase tracking-[0.15em]">
        {title}
      </p>
      <span className="text-sm font-normal flex items-center">
        {text}
        {children}
      </span>
    </dl>
  );
};

function hasContent(value: unknown): boolean {
  return value != null && String(value).trim() !== "";
}

const PLACEHOLDER_IMAGE = "/imgs/placeholder.jpg";

/** Static portfolio data — no time-based ISR (must match static Strapi fetch cache). */
export const revalidate = false;

const normalizePcode = (code: string): string => {
  const n = code.replace(/^0+/, "") || "0";
  return n.length === 1 ? `0${n}` : n.padStart(2, "0");
};

function strapiProjectDataAsList(data: unknown): StrapiProjectNode[] {
  if (Array.isArray(data)) return data as StrapiProjectNode[];
  if (data != null && typeof data === "object")
    return [data as StrapiProjectNode];
  return [];
}

function enforcePortfolioStaticParams(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.CI === "true"
  );
}

export async function generateStaticParams() {
  const strict = enforcePortfolioStaticParams();

  try {
    const res = strict
      ? await fetchStrapiProjectsStrict()
      : await fetchStrapiProjects();
    const data = res.data ?? [];
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
    console.error(
      "[generateStaticParams] /portfolio/projects/[id] failed to load project list from Strapi",
      error,
    );
    return [];
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

  const [pcodeResult, listRes] = await Promise.all([
    fetchStrapiProjectByPcode(pcodeVariants),
    fetchStrapiProjects(),
  ]);

  if (pcodeResult.kind === "not_found") {
    notFound();
  }

  if (pcodeResult.kind === "unavailable") {
    const pdfUrl = "/docs/antonio-ruiz-portfolio-architecture.pdf";

    return (
      <div className="back-cover relative min-h-[100svh] w-full font-sans overflow-hidden">
        <div className="relative z-10 mx-auto min-h-svh max-w-5xl px-6 py-12">
          <h1
            className="font-heading text-xl lg:text-3xl font-bold mb-2"
            style={{ color: "#53A4D7" }}
          >
            project-{id}
            <span style={{ color: "#BB2EB5" }}> ( )</span>
          </h1>

          <div className="rounded border border-amber-500/50 bg-amber-950/20 p-4 text-amber-200">
            <p className="font-medium">Project could not be loaded</p>
            <p className="mt-1 text-sm text-zinc-400">
              Strapi may be temporarily unavailable (e.g. 503). Please try again
              in a moment.
            </p>

            <div className="mt-4 w-full flex flex-col gap-3 sm:flex-row sm:items-center">
              <RetryButton
                hardReload
                label="Retry"
                className="rounded border border-zinc-500 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-800 text-center disabled:opacity-60"
              />
              <a
                href={pdfUrl}
                className="rounded border border-zinc-500 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-800 text-center"
                download
              >
                View PDF Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const projectResponse = { data: pcodeResult.node };

  const projectNode = findProjectByPcode(
    strapiProjectDataAsList(projectResponse.data),
    pcodeVariants,
  );
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

  function normalizeProjectPhotos(raw: unknown): PhotoItem[] {
    if (raw == null) return [];
    const withData = raw as { data?: unknown[] };
    const arr = Array.isArray(withData?.data)
      ? withData.data
      : Array.isArray(raw)
        ? (raw as unknown[])
        : [];
    return arr.map((item) => {
      const o =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};
      const attrs = (o?.attributes ?? o) as Record<string, unknown>;
      return {
        name: [attrs?.name, o?.name].find((v) => typeof v === "string") as
          | string
          | undefined,
        url: [attrs?.url, o?.url].find((v) => typeof v === "string") as
          | string
          | undefined,
        alt: [attrs?.alternativeText, attrs?.alt, o?.alternativeText].find(
          (v) => typeof v === "string",
        ) as string | undefined,
        alternativeText: [attrs?.alternativeText, attrs?.alt].find(
          (v) => typeof v === "string",
        ) as string | undefined,
        caption: [attrs?.caption, o?.caption].find(
          (v) => typeof v === "string",
        ) as string | undefined,
        description: [attrs?.description, o?.description].find(
          (v) => typeof v === "string",
        ) as string | undefined,
      };
    });
  }

  const photos: PhotoItem[] = normalizeProjectPhotos(proj.photos);
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

  const carouselItemsRaw = (photos ?? [])
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
        url: getStrapiMedia(p.url) ?? PLACEHOLDER_IMAGE,
        alt: alt ?? projectName,
        description: description ?? alt ?? projectName,
      };
    });
  const carouselItems =
    carouselItemsRaw.length > 0
      ? carouselItemsRaw
      : [
          {
            url: PLACEHOLDER_IMAGE,
            alt: projectName,
            description: "No image",
          },
        ];

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
  const collabStr =
    typeof interventionData?.collab === "string"
      ? (interventionData.collab as string).trim()
      : "";
  const collaboratorsFromData = (
    interventionData?.collaborators as
      | { data?: { attributes?: { name?: string }; name?: string }[] }
      | undefined
  )?.data;
  const collaboratorsList =
    collabStr.length > 0
      ? collabStr
          .split(/\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : (collaboratorsFromData ?? [])
          .map(
            (c) => c?.attributes?.name ?? (c as { name?: string })?.name ?? "",
          )
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
    <ProjectLayout
      navItems={buildProjectNavItems(listRes.data ?? [])}
      pageSections={buildPageSections(proj)}
      activeId={normalizedId}
    >
      <article className="scrollable-article bg-[#EDE7E3] mt-10 mx-auto max-w-2xl lg:max-w-4xl sm:mt-0 sm:pt-10 pt-4 px-4 md:px-6 sm:px-8 pb-12 relative border-[1px] border-zinc-300 rounded-sm z-10">
        <header className="border-b border-zinc-300 ">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
            {normalizedId} • {String(proj.domain ?? "").toUpperCase()}
          </p>
          <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {String(proj.name ?? "")}
          </h1>
          {proj.summary != null && String(proj.summary) !== "" && (
            <p className="mt-2 mb-4 max-w-2xl text-sm leading-relaxed italic text-[#2B4673] opacity-75 sm:text-base">
              {String(proj.summary)}
            </p>
          )}
        </header>

        <article className="flex flex-col gap-2">
          {proj.domain === "architecture" && (
            <section id="details">
              <DetailsAccordion
                titleSlot={
                  <EntryText
                    title="Project Details"
                    className="text-[0.7rem] pb-0 mb-0"
                    text=""
                  />
                }
              >
                <EntryText
                  title="Location"
                  text={
                    [String(site?.city ?? ""), String(site?.country ?? "")]
                      .join(", ")
                      .trim() || undefined
                  }
                />
                <EntryText
                  title="Project Site"
                  text={String(site?.location ?? "") || undefined}
                >
                  {site?.latitude != null && site?.longitude != null && (
                    <OpenInMapsButton
                      latitude={Number(site.latitude)}
                      longitude={Number(site.longitude)}
                    />
                  )}
                </EntryText>

                <EntryText
                  title="Years"
                  text={
                    String(interventionData?.yearStarted ?? "") +
                    (interventionData?.yearCompleted != null
                      ? ` – ${String(interventionData.yearCompleted)}`
                      : " – Ongoing")
                  }
                />
                {site?.area != null ? (
                  <EntryText
                    title="Site Area"
                    text={`${Number(site.area).toLocaleString("en-US")} m²`}
                  />
                ) : null}
                {interventionData?.area != null ? (
                  <EntryText
                    title="Intervention Area"
                    text={`${Number(interventionData.area).toLocaleString("en-US")} m²`}
                  />
                ) : null}

                {collaboratorsList.length > 0 ? (
                  <EntryText
                    title="Collaborators"
                    text={collaboratorsList.join(" • ")}
                  />
                ) : null}

                {hasContent(interventionData?.materials) ? (
                  <EntryText
                    title="Materials"
                    text={String(interventionData?.materials)}
                  />
                ) : null}

                {hasContent(interventionData?.styles) ? (
                  <EntryText
                    title="Styles"
                    text={String(interventionData?.styles)}
                  />
                ) : null}

                {(() => {
                  const flags: string[] = [];
                  if (interventionData?.isRegenerative)
                    flags.push("Regenerative");
                  if (interventionData?.isSustainable)
                    flags.push("Sustainable");
                  if (interventionData?.usesRegionalMaterials)
                    flags.push("Regional Materials");
                  if (interventionData?.wasComputated) flags.push("Computated");
                  if (interventionData?.wasPrototyped) flags.push("Prototyped");
                  if (flags.length === 0) return null;
                  return (
                    <EntryText title="Attributes" text={flags.join(" • ")} />
                  );
                })()}
              </DetailsAccordion>
            </section>
          )}

          <RenderPhotos
            photos={photos}
            nameContains="cover"
            title=""
            altFallback="Cover Image"
            fallbackSrc={PLACEHOLDER_IMAGE}
          />
        </article>
        <section id="overview" className="mt-10">
          {hasContent(proj.description) && hasContent(overview?.context) && (
            <div>
              <CaptionText title="Overview" text={String(proj.description)} />
              <br />
              <CaptionText title="" text={String(overview?.context)} />
            </div>
          )}
        </section>

        <section className="mt-10 space-y-8 text-sm leading-relaxed sm:text-base">
          {hasContent(overview?.challenges) && (
            <div id="challenges">
              <CaptionText
                title="Challenges"
                text={String(overview?.challenges)}
              />
            </div>
          )}
          {hasContent(overview?.objectives) && (
            <div id="objectives">
              <CaptionText
                title="Objectives"
                text={String(overview?.objectives)}
              />
            </div>
          )}
          {hasContent(overview?.approach) && (
            <div id="approach">
              <CaptionText title="Approach" text={String(overview?.approach)} />
            </div>
          )}

          <RenderPhotos
            photos={photos}
            nameContains="master"
            altFallback="Master Plan Drawing"
            fallbackSrc={PLACEHOLDER_IMAGE}
          />

          {(photos ?? []).filter(
            (p) =>
              p.url?.length &&
              p.url.length > 0 &&
              p.name?.toLowerCase()?.includes("sketches"),
          ).length > 0 && (
            <section className="sketches mt-10">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2">
                {(photos ?? [])
                  .filter(
                    (p) =>
                      p.url?.length &&
                      p.url.length > 0 &&
                      p.name?.toLowerCase()?.includes("sketches"),
                  )
                  .sort((a, b) => {
                    const getNum = (name: string | undefined) => {
                      if (!name) return 0;
                      const match = name.match(/sketches-(\d+)/i);
                      return match ? parseInt(match[1], 10) : 0;
                    };
                    const aNum = getNum(a.name);
                    const bNum = getNum(b.name);
                    if (aNum !== bNum) return aNum - bNum;
                    return String(a.name).localeCompare(String(b.name));
                  })
                  .map((sketch, idx) => (
                    <div key={sketch.url ?? idx}>
                      <ImageWithCaption
                        src={getStrapiMedia(sketch.url) ?? PLACEHOLDER_IMAGE}
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
            fallbackSrc={PLACEHOLDER_IMAGE}
          />
          <RenderPhotos
            photos={photos}
            nameContains="elevation"
            title="Elevations"
            altFallback="Elevation Drawing"
            fallbackSrc={PLACEHOLDER_IMAGE}
          />
          <RenderPhotos
            photos={photos}
            nameContains="section-cut"
            title="Section Cuts"
            altFallback="Section Cut Drawing"
            fallbackSrc={PLACEHOLDER_IMAGE}
          />
          <RenderPhotos
            photos={photos}
            nameContains="facade-cut"
            title="Facade Cuts"
            altFallback="Facade Cut Drawing"
            fallbackSrc={PLACEHOLDER_IMAGE}
          />
          <RenderPhotos
            photos={photos}
            nameContains="construction-detail"
            title="Construction Details"
            altFallback="Construction Detail Drawing"
            fallbackSrc={PLACEHOLDER_IMAGE}
          />

          {hasContent(overview?.results) && (
            <div id="results">
              <CaptionText title="Results" text={String(overview?.results)} />
            </div>
          )}

          {hasContent(overview?.learnings) ||
            (hasContent(overview?.nextSteps) && (
              <div className="grid gap-8 sm:grid-cols-2">
                {hasContent(overview?.learnings) && (
                  <div id="learnings">
                    <CaptionText
                      title="Learnings"
                      text={String(overview?.learnings)}
                    />
                  </div>
                )}
                {hasContent(overview?.nextSteps) && (
                  <div id="next-steps">
                    <CaptionText
                      title="Next steps"
                      text={String(overview?.nextSteps)}
                    />
                  </div>
                )}
              </div>
            ))}
        </section>

        <section
          id="project-timeline"
          className="mt-4 grid gap-8 border-t border-zinc-300 text-xs sm:grid-cols-2"
        >
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
        {tagsList.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1 md:gap-2">
              {String(tagsRaw ?? "")
                .split("\n")
                .map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-[#2B4673]/30 bg-gray-200  italic px-2 md:px-4 h-6 md:h-8 py-2 text-[0.6rem] md:text-[0.7rem] font-semibold text-[#4c6c9e] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        )}
        <section id="gallery" className="mt-8">
          <hr className="border-zinc-500 my-4" />
          <p className="text-[#2B4673] font-bold uppercase tracking-[0.15em] mb-4">
            Gallery
          </p>
          <ImageCarousel
            items={carouselItems}
            width={1200}
            height={800}
            className=""
            fallbackSrc={PLACEHOLDER_IMAGE}
          />
        </section>
        <ProjectMobileNav currentProjectCode={normalizedId} />
      </article>
    </ProjectLayout>
  );
}
