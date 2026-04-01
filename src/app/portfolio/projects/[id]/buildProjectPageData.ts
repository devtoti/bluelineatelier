import type { PhotoItem } from "@/lib/__projectPagePhotos";
import {
  buildCarouselItems,
  normalizeProjectPhotos,
} from "@/lib/__projectPagePhotos";

export type ProjectPageData = {
  photos: PhotoItem[];
  carouselItems: ReturnType<typeof buildCarouselItems>;
  tagsList: string[];
  interventionData: Record<string, unknown> | undefined;
  collaboratorsList: string[];
  site: Record<string, unknown> | undefined;
  overview: Record<string, unknown> | undefined;
  keyStages: Record<string, unknown> | undefined;
};

export function buildProjectPageData(
  proj: Record<string, unknown>,
): ProjectPageData {
  const photos = normalizeProjectPhotos(proj.photos);
  const projectName = String(proj.name ?? "Project image");

  const tagsRaw = proj.tags;
  let tagsList: string[];
  if (Array.isArray(tagsRaw)) {
    tagsList = tagsRaw.flatMap((item: unknown) =>
      String(item)
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    );
  } else if (typeof tagsRaw === "string") {
    tagsList = tagsRaw
      .split(/[\n,]+/)
      .map((s: string) => s.trim())
      .filter(Boolean);
  } else {
    tagsList = [];
  }

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

  const carouselItems = buildCarouselItems(photos, proj, projectName);

  return {
    photos,
    carouselItems,
    tagsList,
    interventionData,
    collaboratorsList,
    site,
    overview,
    keyStages,
  };
}
