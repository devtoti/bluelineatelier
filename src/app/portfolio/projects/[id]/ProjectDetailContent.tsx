import { getStrapiMedia } from "@/utils/getStrapiMedia";
import { DetailsAccordion } from "@/components/DetailsAccordion";
import { OpenInMapsButton } from "@/components/OpenInMapsButton";
import { ProjectMobileNav } from "@/components/ProjectMobileNav";
import { RenderPhotos } from "@/components/RenderPhotos";
import { ImageCarousel } from "@/components/ImageCarousel";
import { ImageWithCaption } from "@/components/ImageWithCaption";
import { CaptionText } from "@/components/portfolio/CaptionText";
import { EntryText } from "@/components/portfolio/EntryText";
import {
  PROJECT_PLACEHOLDER_IMAGE,
  type PhotoItem,
} from "@/lib/__projectPagePhotos";
import type { ProjectPageData } from "./buildProjectPageData";

type ProjectDetailContentProps = {
  normalizedId: string;
  proj: Record<string, unknown>;
} & ProjectPageData;

export function ProjectDetailContent({
  normalizedId,
  proj,
  photos,
  carouselItems,
  tagsList,
  interventionData,
  collaboratorsList,
  site,
  overview,
  keyStages,
}: ProjectDetailContentProps) {
  return (
    <article className="scrollable-article bg-[#EDE7E3] mt-10 mx-auto w-full min-w-0 max-w-2xl lg:max-w-4xl sm:mt-0 sm:pt-10 pt-4 px-4 md:px-6 sm:px-8 pb-12 relative border-[1px] border-zinc-300 rounded-sm z-10 overflow-x-hidden">
      <header className="border-b border-zinc-300 ">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
          {normalizedId} • {String(proj.domain ?? "").toUpperCase()}
        </p>
        <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {String(proj.name ?? "")}
        </h1>
        <p className="mt-2 mb-4 max-w-2xl text-sm leading-relaxed italic text-[#2B4673] opacity-75 sm:text-base">
          {String(proj.summary ?? "")}
        </p>
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
                text={[String(site?.city ?? ""), String(site?.country ?? "")]
                  .join(", ")
                  .trim()}
              />
              <EntryText
                title="Project Site"
                text={String(site?.location ?? "")}
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
              <EntryText
                title="Site Area"
                text={`${Number(site?.area ?? 0).toLocaleString("en-US")} m²`}
              />
              <EntryText
                title="Intervention Area"
                text={`${Number(interventionData?.area ?? 0).toLocaleString("en-US")} m²`}
              />

              <EntryText
                title="Collaborators"
                text={collaboratorsList.join(" • ")}
              />

              <EntryText
                title="Materials"
                text={String(interventionData?.materials ?? "")}
              />

              <EntryText
                title="Styles"
                text={String(interventionData?.styles ?? "")}
              />

              {(() => {
                const flags: string[] = [];
                if (interventionData?.isRegenerative)
                  flags.push("Regenerative");
                if (interventionData?.isSustainable) flags.push("Sustainable");
                if (interventionData?.usesRegionalMaterials)
                  flags.push("Regional Materials");
                if (interventionData?.wasComputated) flags.push("Computated");
                if (interventionData?.wasPrototyped) flags.push("Prototyped");
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
          fallbackSrc={PROJECT_PLACEHOLDER_IMAGE}
        />
      </article>
      <section id="overview" className="mt-10">
        <div>
          <CaptionText title="Overview" text={String(proj.description ?? "")} />
          <br />
          <CaptionText title="" text={String(overview?.context ?? "")} />
        </div>
      </section>

      <section className="mt-10 space-y-8 text-sm leading-relaxed sm:text-base">
        <div id="challenges">
          <CaptionText
            title="Challenges"
            text={String(overview?.challenges ?? "")}
          />
        </div>
        <div id="objectives">
          <CaptionText
            title="Objectives"
            text={String(overview?.objectives ?? "")}
          />
        </div>
        <div id="approach">
          <CaptionText
            title="Approach"
            text={String(overview?.approach ?? "")}
          />
        </div>

        <RenderPhotos
          photos={photos}
          nameContains="master"
          altFallback="Master Plan Drawing"
          fallbackSrc={PROJECT_PLACEHOLDER_IMAGE}
        />

        <section className="sketches mt-10">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2">
            {(photos ?? [])
              .filter(
                (p: PhotoItem) =>
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
                    src={
                      getStrapiMedia(sketch.url) ?? PROJECT_PLACEHOLDER_IMAGE
                    }
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
        <RenderPhotos
          photos={photos}
          nameContains="floor-plan"
          title="Floor Plans"
          altFallback="Floor Plan Drawing"
          fallbackSrc={PROJECT_PLACEHOLDER_IMAGE}
        />
        <RenderPhotos
          photos={photos}
          nameContains="elevation"
          title="Elevations"
          altFallback="Elevation Drawing"
          fallbackSrc={PROJECT_PLACEHOLDER_IMAGE}
        />
        <RenderPhotos
          photos={photos}
          nameContains="section-cut"
          title="Section Cuts"
          altFallback="Section Cut Drawing"
          fallbackSrc={PROJECT_PLACEHOLDER_IMAGE}
        />
        <RenderPhotos
          photos={photos}
          nameContains="facade-cut"
          title="Facade Cuts"
          altFallback="Facade Cut Drawing"
          fallbackSrc={PROJECT_PLACEHOLDER_IMAGE}
        />
        <RenderPhotos
          photos={photos}
          nameContains="construction-detail"
          title="Construction Details"
          altFallback="Construction Detail Drawing"
          fallbackSrc={PROJECT_PLACEHOLDER_IMAGE}
        />

        <div id="results">
          <CaptionText title="Results" text={String(overview?.results ?? "")} />
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div id="learnings">
            <CaptionText
              title="Learnings"
              text={String(overview?.learnings ?? "")}
            />
          </div>
          <div id="next-steps">
            <CaptionText
              title="Next steps"
              text={String(overview?.nextSteps ?? "")}
            />
          </div>
        </div>
      </section>

      <section
        id="project-timeline"
        className="mt-4 grid gap-8 border-t border-zinc-300 text-xs sm:grid-cols-2"
      >
        {/* <div>
          <h2 className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.3em] opacity-70">
            Project timeline
          </h2>
          <ol className="mt-4 space-y-2">
            <li>
              <span className="font-semibold">Initiation:</span>{" "}
              {String(keyStages?.initiation ?? "")}
            </li>
            <li>
              <span className="font-semibold">Planning:</span>{" "}
              {String(keyStages?.planning ?? "")}
            </li>
            <li>
              <span className="font-semibold">Execution:</span>{" "}
              {String(keyStages?.execution ?? "")}
            </li>
            <li>
              <span className="font-semibold">Completion:</span>{" "}
              {String(keyStages?.completion ?? "")}
            </li>
          </ol>
        </div> */}
      </section>
      <div className="mt-2">
        <div className="flex flex-wrap gap-1 md:gap-2">
          {tagsList.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-[#2B4673]/30 bg-gray-200  italic px-2 md:px-4 h-6 md:h-8 py-2 text-[0.6rem] md:text-[0.7rem] font-semibold text-[#4c6c9e] transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
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
          fallbackSrc={PROJECT_PLACEHOLDER_IMAGE}
        />
      </section>
      <ProjectMobileNav currentProjectCode={normalizedId} />
    </article>
  );
}
