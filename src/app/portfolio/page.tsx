import Link from "next/link";
import { PortfolioPageAnimations } from "./PortfolioPageAnimations";

export default async function Portfolio() {
  return (
    <div className="front-cover relative min-h-[100svh] h-svh max-h-svh w-full min-w-0 max-w-full font-sans overflow-hidden">
      <PortfolioPageAnimations>
        <div className="relative text-zinc-300 z-10 sm:px-0 md:px-8 md:py-12 flex flex-col items-start justify-center min-h-svh">
        <div className="headings w-full md:max-w-85 group p-6 hover:bg-black/10 relative flex flex-col items-start justify-between">
          <span className="bracket top-0 left-0 absolute w-4 h-4 border-t-[1px] border-l-[1px] border-white/50 opacity-0 transition-colors duration-400 group-hover:border-white/50 group-hover:opacity-100"></span>
          <span className="bracket top-0 right-0 absolute w-4 h-4 border-t-[1px] border-r-[1px] border-white/50 opacity-0 transition-colors duration-400 group-hover:border-white/50 group-hover:opacity-100"></span>
          <span className="bracket bottom-0 left-0 absolute w-4 h-4 border-b-[1px] border-l-[1px] border-white/50 opacity-0 transition-colors duration-400 group-hover:border-white/50 group-hover:opacity-100"></span>
          <span className="bracket bottom-0 right-0 absolute w-4 h-4 border-b-[1px] border-r-[1px] border-white/50 opacity-0 transition-colors duration-400 group-hover:border-white/50 group-hover:opacity-100"></span>
          <h1 className="text-2xl lg:text-3xl font-bold flex-1 text-[#d6363c] flex-grow w-full">
            <span className="sr-only">antonio ruiz</span>
            <span aria-hidden="true">{'// antonio ruiz'}</span>
          </h1>
          <div className="inline-flex items-baseline">
            <span className="text-[#53A4D7] inline-block">
              {"{"}
              <span className="text-zinc-500"> *</span>
            </span>
            <span
              className="typewriter text-md lg:text-lg font-regular inline-block text-zinc-300 pb-2 min-h-[3.25rem] leading-normal mx-1"
              aria-live="polite"
            >
              <span data-typewriter-text>arkitekturportefølje</span>
              <span className=" text-[#53A4D7] pl-[1px]" aria-hidden="true">
                |
              </span>
            </span>
            <span className="text-[#53A4D7] inline-block">
              <span className="text-zinc-500">* </span>
              {"}"}
            </span>
          </div>
          <div className="space-y-2 w-full">
            <Link
              href="/portfolio/00"
              className="flex items-center justify-center border border-zinc-600 bg-white px-2 py-2 text-sm font-medium text-zinc-900  w-content w-full flex-1 transition-colors hover:border-zinc-300 hover:bg-transparent hover:text-zinc-100 rounded-none max-h-[48px] gap-2"
            >
              <span className="w-5 h-5"></span>
              Start Now
              <span className="mr-2 flex items-center">
                <svg
                  className="h-5 w-5 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#71717a"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </span>
            </Link>
            <a
              href="/docs/antonio-ruiz-portfolio-architecture.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-invert items-center justify-center border border-zinc-600 bg-white/10 px-2 py-2 text-sm font-medium text-zinc-400 bg-white/10 w-content w-full flex-1 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 rounded-none max-h-[48px] gap-2"
            >
              <span className="w-5 h-5"></span>
              View PDF
              <svg
                className="mr-2 h-5 w-5 text-zinc-400"
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
            </a>
          </div>
        </div>
        </div>
      </PortfolioPageAnimations>
    </div>
  );
}
