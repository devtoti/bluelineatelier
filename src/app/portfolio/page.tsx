import Link from "next/link";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { Suspense } from "react";
import Projects from "./Projects";
import { getProjects, type StrapiProjectsResponse } from "@/lib/strapiProjects";
import { buildProjectNavItems } from "@/lib/portfolioNav";
import { ProjectNavigation } from "@/components/ProjectNavigation";
import HandsBackground from "@/components/HandsBackground";
import perspective from "../../../public/imgs/perspective-dark.jpg";

const emptyProjects: StrapiProjectsResponse = { data: [] };

export default async function Portfolio() {
  let projectsData = emptyProjects;
  try {
    projectsData = await getProjects();
  } catch (err) {
    console.error("Strapi fetch failed:", err);
  }

  return (
    <div className="front-cover relative min-h-[100svh] w-full min-w-0 max-w-full font-sans overflow-x-hidden">
      <div className="fixed bottom-6 left-6 z-20 hidden lg:block">
        {/* <ProjectNavigation items={projectNavItems} activeId="cover" darkBg /> */}
      </div>
      <div className="relative space-y-2 text-zinc-400 z-10 px-8 py-12 flex flex-col items-start justify-center min-h-svh">
        <h1 className="text-4xl font-bold text-[#C53135]">antonio ruiz</h1>
        <p className="text-xl font-regular">arkitekturportefølje</p>
        <a
          href="/docs/antonio-ruiz-portfolio-architecture.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center border border-zinc-600 bg-transparent px-6 py-3 text-sm font-medium text-zinc-400 bg-white/10 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 rounded-none min-w-[220px] max-h-[48px]"
        >
          <svg
            className="mr-2 h-5 w-5 text-zinc-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.7}
            aria-hidden="true"
          >
            <rect
              x="5"
              y="3"
              width="14"
              height="18"
              rx="2"
              stroke="currentColor"
              fill="white"
            />
            <path
              d="M9 7h6M9 11h6M9 15h2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.5 3v4a1 1 0 001 1h4"
              stroke="currentColor"
              strokeLinejoin="round"
            />
          </svg>
          View PDF Portfolio
        </a>
      </div>
    </div>
  );
}
