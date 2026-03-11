"use client";

import { ImageWithCaption } from "@/components/ImageWithCaption";
import { getStrapiMedia } from "@/utils/getStrapiMedia";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const photoViewBeigeBackdrop = `.PhotoView-Slider__Backdrop { background: #e8e4dc !important; }`;

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
  /** Fallback image URL when a photo fails to load or has no url (e.g. /imgs/placeholder.jpg) */
  fallbackSrc?: string;
};

/**
 * "Natural sort" helper that compares two strings of a photo name in a way so
 * "unit-floor-plan-01" < "unit-floor-plan2".
 * Extracts any trailing group of digits from the photo name and sorts numerically,
 * otherwise falls back to regular string comparison.
 */
function naturalCompare(a: string, b: string): number {
  const re = /(\d+)(?!.*\d)/; // last group of digits in string
  const matchA = a.match(re);
  const matchB = b.match(re);

  if (matchA && matchB) {
    const [numA, numB] = [parseInt(matchA[1], 10), parseInt(matchB[1], 10)];
    if (a.slice(0, matchA.index) === b.slice(0, matchB.index)) {
      // If the prefix before the number is equal, compare on number
      return numA - numB;
    }
  }
  // fallback: localeCompare for consistent alphabetical order
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

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
  return photos
    .filter(
      (p) =>
        typeof p?.url === "string" &&
        p.url.length > 0 &&
        typeof p.name === "string" &&
        p.name.toLowerCase().includes(key),
    )
    .sort((a, b) => {
      const nameA = a.name ?? "";
      const nameB = b.name ?? "";
      return naturalCompare(nameA, nameB);
    });
}

export function RenderPhotos({
  photos,
  nameContains,
  title,
  altFallback,
  width = 1200,
  height = 900,
  fallbackSrc = "/imgs/placeholder.jpg",
}: RenderPhotosProps) {
  const list = photos ?? [];
  if (!hasMatchingPhoto(list, nameContains)) return null;

  const items = filterPhotos(list, nameContains);

  return (
    <PhotoProvider loop={items.length} maskClosable pullClosable>
      <style dangerouslySetInnerHTML={{ __html: photoViewBeigeBackdrop }} />
      <article className="mt-10">
        {title != null && title !== "" && (
          <h3 className="text-base font-bold uppercase tracking-[0.15em] text-[#2B4673] mb-2">
            {title}
          </h3>
        )}
        <div className="grid grid-cols-1 gap-4 mt-2 sm:gap-5 lg:gap-6">
          {items.map((photo, idx) => {
            const rawSrc = getStrapiMedia(photo.url!);
            const src = rawSrc ?? fallbackSrc;
            const alt = String(
              photo.alt ??
                photo.alternativeText ??
                photo.name ??
                `${altFallback} ${idx + 1}`,
            );
            return (
              <PhotoView key={photo.url ?? idx} src={src}>
                <div className="cursor-pointer">
                  <ImageWithCaption
                    src={src}
                    alt={alt}
                    description={photo.caption ?? photo.description ?? ""}
                    width={width}
                    height={height}
                    figureClassName="border-[#2B4673]"
                    fallbackSrc={fallbackSrc}
                  />
                </div>
              </PhotoView>
            );
          })}
        </div>
      </article>
    </PhotoProvider>
  );
}
