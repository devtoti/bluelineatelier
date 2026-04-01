import { getStrapiMedia } from "@/utils/getStrapiMedia";
import type { CarouselItem } from "@/components/ImageCarousel";

export const PROJECT_PLACEHOLDER_IMAGE = "/imgs/placeholder.jpg";

export type PhotoItem = {
  name?: string;
  url?: string;
  alt?: string;
  alternativeText?: string;
  description?: string;
  caption?: string;
};

export function normalizeProjectPhotos(raw: unknown): PhotoItem[] {
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

export function buildCarouselItems(
  photos: PhotoItem[],
  proj: Record<string, unknown>,
  projectName: string,
): CarouselItem[] {
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
        url: getStrapiMedia(p.url) ?? PROJECT_PLACEHOLDER_IMAGE,
        alt: alt ?? projectName,
        description: description ?? alt ?? projectName,
      };
    });

  if (carouselItemsRaw.length > 0) return carouselItemsRaw;
  return [
    {
      url: PROJECT_PLACEHOLDER_IMAGE,
      alt: projectName,
      description: "No image",
    },
  ];
}
