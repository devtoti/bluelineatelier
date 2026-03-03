// Path: ./src/app/ui/articles.tsx

import { use } from "react";
import Link from "next/link";

export default function Projects({ projects }: { projects: Promise<any> }) {
  const allProjects = use(projects);
  const items: any[] = Array.isArray(allProjects?.data)
    ? allProjects.data
    : [];

  return (
    <section aria-label="Projects" className="w-full text-left">
      <h2 className="font-heading mb-4 text-left text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
        Selected Projects
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((project: any) => {
          const attrs = project.attributes ?? project;

          return (
            <Link
              key={attrs.pcode ?? attrs.code ?? project.id}
              href={`/portfolio/projects/${attrs.pcode ?? attrs.code ?? project.id}`}
              className="group block rounded-lg border border-zinc-800 bg-black/40 p-4 text-left transition-colors hover:border-zinc-500"
            >
              <h3 className="font-heading mb-1 text-base font-semibold text-white group-hover:text-blue-300">
                {attrs.name ?? attrs.title ?? `Project ${attrs.pcode ?? project.id}`}
              </h3>
              <p className="line-clamp-3 text-sm text-zinc-400">
                {attrs.description ?? ""}
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
