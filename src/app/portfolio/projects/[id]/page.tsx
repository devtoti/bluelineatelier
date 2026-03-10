import type { ReactNode } from "react";
import "../../../../projects.css";
import { notFound, redirect } from "next/navigation";
import { getStrapiMedia } from "../../../../utils/getStrapiMedia";
import { RenderPhotos } from "@/components/RenderPhotos";
import { ImageCarousel } from "../../../../components/ImageCarousel";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import {
  getProjects,
  findProjectByPcode,
  type StrapiProjectNode,
} from "@/lib/strapiProjects";

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

  if (normalizedId === "00") {
    redirect("/portfolio/00");
  }

  if (normalizedId === "07") {
    redirect("/portfolio/contact");
  }

  let data: StrapiProjectNode[] = [];
  try {
    const res = await getProjects();
    data = res.data ?? [];
  } catch (err) {
    console.error("Strapi fetch failed:", err);
  }

  const altPcode = normalizedId.replace(/^0+/, "") || "0";
  const pcodeVariants = [normalizedId, altPcode].filter(
    (v, i, a) => a.indexOf(v) === i,
  );
  const projectNode = findProjectByPcode(
    Array.isArray(data) ? data : [],
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
    <article className="scrollable-article mt-10 mx-auto max-w-4xl sm:mt-0 sm:pt-10 pt-4 px-4 md:px-6 sm:px-8 pb-12 relative bg-black/2 border-[1px] border-zinc-300 rounded-sm">
      {/* <span className="bracket top-0 left-0 absolute w-5 h-5 border-t-2 border-l-2 border-blue-800 opacity-100"></span>
      <span className="bracket top-0 right-0 absolute w-5 h-5 border-t-2 border-r-2 border-blue-800 opacity-100"></span>
      <span className="bracket bottom-0 left-0 absolute w-5 h-5 border-b-2 border-l-2 border-blue-800 opacity-100"></span>
      <span className="bracket bottom-0 right-0 absolute w-5 h-5 border-b-2 border-r-2 border-blue-800 opacity-100"></span> */}
      {/* Masthead */}
      <header className="border-b border-zinc-300 ">
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
      </header>

      {/* Hero image carousel / Gallery */}
      {carouselItems.length > 0 && (
        <section id="gallery" className="mt-8">
          <ImageCarousel
            items={carouselItems}
            width={1200}
            height={800}
            className=""
          />
        </section>
      )}
      {/* Meta grid */}
      {proj.domain === "architecture" && (
        <section
          id="details"
          className="overview mt-8 bg-black/5 py-4 px-2 grid gap-6 text-xs sm:grid-cols-3"
        >
          <>
            <dl className="space-y-2">
              <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                Location
              </dt>
              <dd>
                {[String(site?.city ?? ""), String(site?.country ?? "")].join(
                  ", ",
                )}
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
                  <dd>{Number(interventionData.area).toLocaleString()} m²</dd>
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
      <section id="overview" className="mt-10">
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
          {(text) => (
            <div id="challenges">
              <CaptionText title="Challenges" text={text} />
            </div>
          )}
        </ShowWhenText>
        <ShowWhenText value={overview?.objectives}>
          {(text) => (
            <div id="objectives">
              <CaptionText title="Objectives" text={text} />
            </div>
          )}
        </ShowWhenText>
        <ShowWhenText value={overview?.approach}>
          {(text) => (
            <div id="approach">
              <CaptionText title="Approach" text={text} />
            </div>
          )}
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
          <section className="sketches mt-10">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2">
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
          {(text) => (
            <div id="results">
              <CaptionText title="Results" text={text} />
            </div>
          )}
        </ShowWhenText>

        <When
          ok={
            hasContent(overview?.learnings) || hasContent(overview?.nextSteps)
          }
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <ShowWhenText value={overview?.learnings}>
              {(text) => (
                <div id="learnings">
                  <CaptionText title="Learnings" text={text} />
                </div>
              )}
            </ShowWhenText>
            <ShowWhenText value={overview?.nextSteps}>
              {(text) => (
                <div id="next-steps">
                  <CaptionText title="Next steps" text={text} />
                </div>
              )}
            </ShowWhenText>
          </div>
        </When>
      </section>

      {/* Key stages */}
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
    </article>
  );
}
