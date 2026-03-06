import { ImageWithCaption } from "@/components/ImageWithCaption";
import { getStrapiMedia } from "@/utils/getStrapiMedia";

export type PhotoGridItem = {
  url?: string;
  name?: string;
  alt?: string;
  alternativeText?: string;
  caption?: string;
  description?: string;
};

export type RenderPhotosProps = {
  photos: PhotoGridItem[] | undefined;
  /** Substring to match in photo name (case-insensitive), e.g. "master", "floor-plan", "construction-detail" */
  nameContains: string;
  /** Section heading, e.g. "Master Plans", "Construction Details" */
  title?: string;
  /** Fallback alt prefix when photo has no alt/name, e.g. "Master Plan Drawing" → "Master Plan Drawing 1" */
  altFallback: string;
  /** Image width (default 1200) */
  width?: number;
  /** Image height (default 900) */
  height?: number;
};

function hasMatchingPhoto(
  photos: PhotoGridItem[],
  nameContains: string,
): boolean {
  const key = nameContains.toLowerCase();
  return photos.some(
    (p) =>
      typeof p?.url === "string" &&
      p.url.length > 0 &&
      typeof p.name === "string" &&
      p.name.toLowerCase().includes(key),
  );
}

function filterPhotos(photos: PhotoGridItem[], nameContains: string) {
  const key = nameContains.toLowerCase();
  return photos.filter(
    (p) =>
      typeof p?.url === "string" &&
      p.url.length > 0 &&
      typeof p.name === "string" &&
      p.name.toLowerCase().includes(key),
  );
}

export function RenderPhotos({
  photos,
  nameContains,
  title,
  altFallback,
  width = 1200,
  height = 900,
}: RenderPhotosProps) {
  const list = photos ?? [];
  if (!hasMatchingPhoto(list, nameContains)) return null;

  const items = filterPhotos(list, nameContains);

  return (
    <article className="mt-10">
      {title != null && title !== "" && (
        <h3 className="text-base font-bold uppercase tracking-[0.15em] text-[#2B4673] mb-2">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 gap-4 mt-2 sm:gap-5  lg:gap-6">
        {items.map((photo, idx) => (
          <ImageWithCaption
            key={photo.url ?? idx}
            src={getStrapiMedia(photo.url!)}
            alt={String(
              photo.alt ??
                photo.alternativeText ??
                photo.name ??
                `${altFallback} ${idx + 1}`,
            )}
            description={photo.caption ?? photo.description ?? ""}
            width={width}
            height={height}
            figureClassName="border-[#2B4673]"
          />
        ))}
      </div>
    </article>
  );
}
