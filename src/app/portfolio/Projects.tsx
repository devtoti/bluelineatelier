import Link from "next/link";
import type {
  StrapiProjectsResponse,
  StrapiProjectNode,
} from "@/lib/__strapiProjectsCore";

function toTwoDigitPcode(value: string | number | undefined): string {
  if (value == null) return "00";
  const s = String(value).replace(/^0+/, "") || "0";
  return s.length === 1 ? `0${s}` : s.padStart(2, "0");
}

export default function Projects({
  projects,
}: {
  projects: StrapiProjectsResponse;
}) {
  const items: StrapiProjectNode[] = Array.isArray(projects?.data)
    ? projects.data
    : [];

  return (
    <section aria-label="Projects" className="w-full text-left">
      <h2 className="font-heading mb-4 text-left text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
        Selected Projects
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((project) => {
          const attrs =
            project.attributes ?? (project as Record<string, unknown>);
          const rawPcode = attrs.pcode ?? attrs.code ?? project.id;
          const pcode = toTwoDigitPcode(
            typeof rawPcode === "string" || typeof rawPcode === "number"
              ? rawPcode
              : undefined,
          );
          const name =
            String(attrs.name ?? attrs.title ?? `Project ${pcode}`).trim() ||
            `Project ${pcode}`;
          const description = String(attrs.description ?? "").trim();

          return (
            <Link
              key={pcode}
              href={`/portfolio/projects/${pcode}`}
              className="group block rounded-lg border border-zinc-800 bg-black/40 p-4 text-left transition-colors hover:border-zinc-500"
            >
              <h3 className="font-heading mb-1 text-base font-semibold text-white group-hover:text-blue-300">
                {name}
              </h3>
              <p className="line-clamp-3 text-sm text-zinc-400">
                {description}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                View project →
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
