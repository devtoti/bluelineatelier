import Link from "next/link";
import Image from "next/image";
import type {
  StrapiProjectsResponse,
  StrapiProjectNode,
} from "@/lib/strapiProjects";
import { getStrapiMedia } from "@/utils/getStrapiMedia";

function toTwoDigitPcode(value: string | number | undefined): string {
  if (value == null) return "00";
  const s = String(value).replace(/^0+/, "") || "0";
  return s.length === 1 ? `0${s}` : s.padStart(2, "0");
}

type PhotoItem = {
  name?: string;
  url?: string;
};

function getThumbnailUrl(projectNode: StrapiProjectNode): string | null {
  const attrs =
    projectNode?.attributes ?? (projectNode as Record<string, unknown>);
  const photos = attrs?.photos as PhotoItem[] | undefined;
  if (!Array.isArray(photos) || photos.length === 0) return null;
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

export type TableOfContentsProps = {
  projects: StrapiProjectsResponse;
  className?: string;
};

export function TableOfContents({
  projects,
  className = "",
}: TableOfContentsProps) {
  const items: StrapiProjectNode[] = Array.isArray(projects?.data)
    ? projects.data
    : [];

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            ".toc-card-link:hover .toc-card-pcode { color: #FACF6A !important; }",
        }}
      />
      <section
        aria-label="Table of Contents"
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
      >
        {items.map((project) => {
          const attrs =
            project.attributes ?? (project as Record<string, unknown>);
          const pcode = toTwoDigitPcode(
            attrs?.pcode ?? attrs?.code ?? project.id,
          );
          const name =
            String(attrs?.name ?? attrs?.title ?? `Project ${pcode}`).trim() ||
            `Project ${pcode}`;
          const summary =
            String(attrs?.summary ?? attrs?.description ?? "").trim() || "";
          const thumbnailUrl = getThumbnailUrl(project);
          const href = `/portfolio/projects/${pcode}`;

          return (
            <Link
              key={pcode}
              href={href}
              className="toc-card-link card group relative flex flex-col overflow-hidden border border-gray-600/50 bg-black/20 shadow-sm transition-shadow hover:shadow-md hover:border-zinc-100 hover:bg-black/20 border-solid focus:outline-none focus:ring-2 focus:ring-[#2B4673] focus:ring-offset-2"
            >
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <h2 className="toc-card-pcode font-heading text-3xl font-medium text-zinc-200 transition-colors duration-200">
                    {pcode || "00"}
                  </h2>
                </div>
                {thumbnailUrl ? (
                  <div className="absolute inset-0 w-full h-full bg-black/40 flex items-center justify-center">
                    <Image
                      src={thumbnailUrl}
                      alt=""
                      fill
                      className="object-contain transition-transform group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center text-zinc-400"
                    aria-hidden
                  >
                    <span className="text-sm font-medium">No image</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4 text-left">
                <h3 className="font-heading text-lg font-semibold text-zinc-200 group-hover:underline">
                  {name}
                </h3>
                {summary ? (
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-zinc-500">
                    {summary}
                  </p>
                ) : null}
                <p className="mt-3 text-xs font-medium uppercase tracking-widest text-zinc-500 opacity-80">
                  View project →
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}
