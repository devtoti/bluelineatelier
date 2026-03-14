"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type {
  StrapiProjectsResponse,
  StrapiProjectNode,
} from "@/lib/strapiProjects";
import { getStrapiMedia } from "@/utils/getStrapiMedia";

const FALLBACK_IMAGE = "/imgs/placeholder.jpg";
const FALLBACK_IMAGE_ALT = "No image";

function toTwoDigitPcode(value: string | number | undefined): string {
  if (value == null) return "00";
  const s = String(value).replace(/^0+/, "") || "0";
  return s.length === 1 ? `0${s}` : s.padStart(2, "0");
}

type PhotoItem = {
  name?: string;
  url?: string;
};

/** Normalize Strapi media relation (data[].attributes) or flat array to PhotoItem[]. */
function normalizeProjectPhotos(photos: unknown): PhotoItem[] {
  if (Array.isArray(photos)) {
    const first = photos[0];
    if (first && typeof first === "object" && "attributes" in first) {
      return (photos as { attributes?: { name?: string; url?: string } }[]).map(
        (item) => ({
          name: item?.attributes?.name,
          url: item?.attributes?.url,
        }),
      );
    }
    return (photos as PhotoItem[]).filter(
      (p): p is PhotoItem => p != null && typeof p === "object",
    );
  }
  const data = (
    photos as
      | { data?: { attributes?: { name?: string; url?: string } }[] }
      | undefined
  )?.data;
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    name: item?.attributes?.name,
    url: item?.attributes?.url,
  }));
}

function getThumbnailUrl(projectNode: StrapiProjectNode): string | null {
  const attrs =
    projectNode?.attributes ?? (projectNode as Record<string, unknown>);
  const photos = normalizeProjectPhotos(attrs?.photos);
  if (photos.length === 0) return null;
  const withUrl = photos.filter(
    (p): p is PhotoItem & { url: string } =>
      typeof p?.url === "string" && p.url.length > 0,
  );
  if (withUrl.length === 0) return null;
  const coverOrThumb = withUrl.find((p) =>
    p.name?.toLowerCase().includes("thumbnail"),
  );
  const pick = coverOrThumb ?? withUrl[0];
  return getStrapiMedia(pick.url) ?? null;
}

type CardProps = {
  pcode: string;
  name: string;
  summary: string;
  domain: string;
  thumbnailUrl: string | null;
  href: string;
};

function Card({ pcode, name, summary, domain, thumbnailUrl, href }: CardProps) {
  return (
    <Link
      key={pcode}
      href={href}
      className="toc-card-link card group relative flex h-full w-full flex-col overflow-hidden border border-[1px] border-gray-600/20 shadow-sm transition-shadow hover:shadow-md hover:border-[#53A4D7] hover:bg-black/10 border-solid focus:outline-none focus:ring-1 focus:ring-[#53A4D7] focus:ring-offset-2"
      style={{ cursor: "pointer" }}
    >
      <span className="bracket top-0 left-0 absolute w-4 h-4 border-t-1 border-l-1 border-white opacity-30 group-hover:opacity-0"></span>
      <span className="bracket top-0 right-0 absolute w-4 h-4 border-t-1 border-r-1 border-white opacity-30 group-hover:opacity-0"></span>
      <span className="bracket bottom-0 left-0 absolute w-4 h-4 border-b-1 border-l-1 border-white opacity-30 group-hover:opacity-0"></span>
      <span className="bracket bottom-0 right-0 absolute w-4 h-4 border-b-1 border-r-1 border-white opacity-30 group-hover:opacity-0"></span>
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-4 z-10">
          <h2 className="toc-card-pcode font-heading text-2xl font-regular text-zinc-400 transition-colors duration-400">
            {pcode || "00"}
          </h2>
        </div>
        {thumbnailUrl ? (
          <div className="absolute inset-0 p-12 w-full h-full bg-black/5 flex items-center justify-center">
            <Image
              src={thumbnailUrl}
              alt=""
              fill
              className="object-contain object-center h-3/5 transition-transform scale-80 transition-opacity duration-400 opacity-50 group-hover:opacity-100 group-hover:scale-90 mix-blend-multiply"
              sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 20vw"
            />
          </div>
        ) : (
          <Image
            src={FALLBACK_IMAGE}
            alt={FALLBACK_IMAGE_ALT}
            fill
            className="object-contain transition-transform group-hover:scale-[1.02] opacity-30"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-4 text-left bg-black/15 pointer-events-none">
        <h3 className="font-heading text-lg font-regular group-hover:text-zinc-200 text-zinc-400 ">
          {name}
        </h3>
        <span className="mt-2 inline-block w-min capitalize px-3 py-1 text-xs font-regular rounded-full bg-[#191F30] text-[#53A4D7] border border-[#53A4D7]/30 opacity-90 shadow-sm pointer-events-auto">
          {domain}
        </span>
        {summary ? (
          <p className="mt-2 line-clamp-4 flex-1 h-32 text-xs text-zinc-600">
            {summary}
          </p>
        ) : null}
        {/* <p className="mt-3 text-xs font-regular uppercase tracking-widest text-[#53A4D7] opacity-80">
          View project →
        </p> */}
      </div>
    </Link>
  );
}

export type TableOfContentsProps = {
  projects: StrapiProjectsResponse;
  className?: string;
};

export function TableOfContents({
  projects,
  className = "",
}: TableOfContentsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Put all projects in "itemsByPcode", mapping pcode -> project
  const itemsByPcode: Record<string, StrapiProjectNode> = {};
  if (Array.isArray(projects?.data)) {
    for (const project of projects.data) {
      const attrs = project.attributes ?? (project as Record<string, unknown>);
      // Guarantee two-digit string for pcode, fallback to id if missing
      const rawPcode = attrs?.pcode ?? attrs?.code ?? project.id;
      const pcode = toTwoDigitPcode(
        typeof rawPcode === "string" || typeof rawPcode === "number"
          ? rawPcode
          : undefined,
      );
      if (["01", "02", "03", "04", "05", "06"].includes(pcode)) {
        itemsByPcode[pcode] = project;
      }
    }
  }

  // Always order by explicit "01"-"06"
  const orderedPcodes = ["01", "02", "03", "04", "05", "06"];
  const items: StrapiProjectNode[] = orderedPcodes
    .map((pcode) => itemsByPcode[pcode])
    .filter(Boolean);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const cards =
      sectionRef.current.querySelectorAll<HTMLElement>(".toc-card-link");
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 24,
        duration: 1.0,
        stagger: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            ".toc-card-link { cursor: pointer !important; } .toc-card-link:hover .toc-card-pcode { color: #FACF6A !important; }",
        }}
      />
      <section
        ref={sectionRef}
        aria-label="Table of Contents"
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch ${className}`}
      >
        {items.map((project) => {
          const attrs =
            project.attributes ?? (project as Record<string, unknown>);
          const rawPcode = attrs?.pcode ?? attrs?.code ?? project.id;
          const pcode = toTwoDigitPcode(
            typeof rawPcode === "string" || typeof rawPcode === "number"
              ? rawPcode
              : undefined,
          );
          const name =
            String(attrs?.name ?? attrs?.title ?? `Project ${pcode}`).trim() ||
            `Project ${pcode}`;
          const summary =
            String(attrs?.summary ?? attrs?.description ?? "").trim() || "";
          const thumbnailUrl = getThumbnailUrl(project);
          const href = `/portfolio/projects/${pcode}`;
          const domain =
            typeof attrs?.domain === "string" ? attrs.domain : "architecture";
          return (
            <Card
              key={pcode}
              pcode={pcode}
              name={name}
              summary={summary}
              thumbnailUrl={thumbnailUrl}
              href={href}
              domain={domain}
            />
          );
        })}
      </section>
    </>
  );
}
