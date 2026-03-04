import Image from "next/image";
import Link from "next/link";
import "../../../../projects.css";
import { notFound } from "next/navigation";
import { getStrapiMedia } from "../../../../utils/getStrapiMedia";
const PROJECT_ORDER = ["00", "01", "02", "03", "04", "05", "06", "07"] as const;

type ProjectPageProps = {
  params: Promise<{ id: string }>;
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

  async function getMediaAssets(fileId: number) {
    const res = await fetch(`${baseUrl}/api/upload/files/${fileId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch media assets");
    }
    return res.json();
  }

  const assets = (proj.assets ??
    (projectNode as Record<string, unknown>).assets) as
    | { id?: number; url?: string }[]
    | undefined;
  console.log("photos", proj.photos);
  console.log("assets", assets);
  const firstAsset = assets?.[0];
  const coverUrl =
    firstAsset?.url != null
      ? getStrapiMedia(firstAsset.url)
      : firstAsset?.id != null
        ? await getMediaAssets(firstAsset.id)
            .then((file) => (file?.url ? getStrapiMedia(file.url) : null))
            .catch(() => null)
        : null;

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
            <dl className="space-y-2">
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                  Location
                </dt>
                <dd>
                  {String(site?.city ?? "")}, {String(site?.country ?? "")}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                  Site
                </dt>
                <dd>{String(site?.location ?? "")}</dd>
              </div>
            </dl>

            <dl className="space-y-2">
              <div>
                <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                  Years
                </dt>
                <dd>
                  {String(interventionData?.yearStarted ?? "")}
                  {interventionData?.yearCompleted != null
                    ? ` – ${interventionData.yearCompleted}`
                    : " – Ongoing"}
                </dd>
              </div>
              {interventionData?.area != null && (
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                    Area
                  </dt>
                  <dd>{Number(interventionData.area).toLocaleString()} m²</dd>
                </div>
              )}
            </dl>

            <dl className="space-y-2">
              {collaboratorsList.length > 0 && (
                <div>
                  <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                    Collaborators
                  </dt>
                  <dd>{collaboratorsList.join(", ")}</dd>
                </div>
              )}
            </dl>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                Scale
              </dt>
              <dd className="capitalize">{String(proj.scale ?? "")}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                Status
              </dt>
              <dd className="capitalize">{String(proj.projectStatus ?? "")}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                Regional materials
              </dt>
              <dd>{interventionData?.usesRegionalMaterials ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                Computational tools
              </dt>
              <dd>{interventionData?.wasComputated ? "Used" : "Not used"}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                Prototype built
              </dt>
              <dd>{interventionData?.wasPrototyped ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                Regenerative focus
              </dt>
              <dd>{interventionData?.isRegenerative ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
                Sustainable design
              </dt>
              <dd>{interventionData?.isSustainable ? "Yes" : "No"}</dd>
            </div>
          </section>
          {/* Hero image */}
          {coverUrl && (
            <figure className="mt-8 overflow-hidden rounded-lg border border-zinc-300 bg-white/60">
              <Image
                src={coverUrl}
                alt={String(proj.name ?? "")}
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
              />
            </figure>
          )}

          {/* Narrative sections */}
          <section className="mt-10 space-y-8 text-sm leading-relaxed sm:text-base">
            {overview?.context != null && String(overview.context) !== "" ? (
              <section>
                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                  Context
                </h2>
                <p className="mt-3 whitespace-pre-line">
                  {String(overview.context)}
                </p>
              </section>
            ) : null}

            {overview?.challenges != null &&
            String(overview.challenges) !== "" ? (
              <section>
                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                  Challenges
                </h2>
                <p className="mt-3 whitespace-pre-line">
                  {String(overview.challenges)}
                </p>
              </section>
            ) : null}

            {overview?.approach != null && String(overview.approach) !== "" ? (
              <section>
                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                  Approach
                </h2>
                <p className="mt-3 whitespace-pre-line">
                  {String(overview.approach)}
                </p>
              </section>
            ) : null}

            {overview?.results != null && String(overview.results) !== "" ? (
              <section>
                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                  Results
                </h2>
                <p className="mt-3 whitespace-pre-line">
                  {String(overview.results)}
                </p>
              </section>
            ) : null}

            {(overview?.learnings != null &&
              String(overview.learnings) !== "") ||
            (overview?.nextSteps != null &&
              String(overview.nextSteps) !== "") ? (
              <section className="grid gap-8 sm:grid-cols-2">
                {overview?.learnings != null &&
                String(overview.learnings) !== "" ? (
                  <div>
                    <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                      Learnings
                    </h2>
                    <p className="mt-3 whitespace-pre-line">
                      {String(overview.learnings)}
                    </p>
                  </div>
                ) : null}
                {overview?.nextSteps != null &&
                String(overview.nextSteps) !== "" ? (
                  <div>
                    <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                      Next steps
                    </h2>
                    <p className="mt-3 whitespace-pre-line">
                      {String(overview.nextSteps)}
                    </p>
                  </div>
                ) : null}
              </section>
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
