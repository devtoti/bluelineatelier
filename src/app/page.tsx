"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div
      className="relative min-h-screen font-sans"
      style={{ backgroundColor: "#0C1222" }}
    >
      <div className="portfolio-grain" aria-hidden />
      <div className="portfolio-grid" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-screen w-full flex-col py-6">
        <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-16 text-center">
          {/* <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: -1,
              pointerEvents: "none",
              backgroundImage: 'url("/imgs/perspective.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              // filter: "invert(1)",
              mixBlendMode: "luminosity",
            }}
            aria-hidden="true"
          /> */}
          <article className="flex justify-center mt-4 w-50">
            <div className="flex items-center gap-2 rounded-full border border-amber-500/50 border-dashed px-4 py-1 w-auto shadow min-h-[2.5rem]">
              <span className="relative inline-block w-5 h-5">
                <span className="absolute inset-0 flex items-center justify-center w-full h-full">
                  <span className="relative flex items-center justify-center w-full h-full">
                    {/* Outer circle grows and fades smoothly from center with infinite repeat */}
                    <span
                      className="absolute bg-orange-500 rounded-full opacity-70 pointer-events-none"
                      style={{
                        animation:
                          "c-grow-repeat 2.5s cubic-bezier(0.45,0,0.55,1) infinite",
                        width: "1.25rem",
                        height: "1.25rem",
                      }}
                    />
                    {/* Inner dot remains centered */}
                    <span className="relative bg-orange-300 w-3 h-3 rounded-full z-10 pointer-events-none" />
                  </span>
                </span>
                <style jsx>{`
                  @keyframes c-grow-repeat {
                    0% {
                      transform: scale(0.42);
                      opacity: 0.3;
                    }
                    45% {
                      transform: scale(1);
                      opacity: 0.7;
                    }
                    85% {
                      transform: scale(1.3);
                      opacity: 0;
                    }
                    100% {
                      transform: scale(0.42);
                      opacity: 0;
                    }
                  }
                `}</style>
              </span>
              <span className="text-sm font-medium text-amber-600 w-full select-none pl-1 pr-2">
                Site in progress
              </span>
            </div>
          </article>
          <h1 className="mt-8 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Blueline Atelier
          </h1>
          <p className="mt-6 max-w-xl text-md leading-relaxed text-zinc-400 sm:text-lg">
            Innovative architectural solutions using computational and modern
            software development tools
          </p>
          <Link
            href="/portfolio"
            className="mt-10 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            {/* Document PDF SVG icon */}
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
            View Portfolio
          </Link>
        </main>

        <aside
          className="w-full border-y border-zinc-800 bg-zinc-900/50 py-8 text-center md:py-10"
          aria-label="Banner"
        >
          <p className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 sm:text-base">
            Bridging the gap between design precision and project execution
            through the use of modern technologies such as BIM modeling, AI
            renderings, parametric design, and scalable design systems that
            adapt to change and team collaboration.
          </p>
        </aside>

        <section
          id="about"
          className="scroll-mt-6 w-full border-t flex align-center justify-center flex-col w-full border-zinc-800 px-6 py-16 text-center md:py-24"
        >
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            About Blueline
          </h2>
          <p className="mx-auto my-6 max-w-2xl text-left text-base leading-relaxed text-zinc-400 sm:text-lg">
            This experimental atelier is born as a result of working both on IT
            and the architectural domain over the past 5+ years. We seek to
            offer specialized tools to architects, engineers, and construction
            workers in order to facilitate the design-cycle processes and
            cross-disciplinary work.
          </p>
          <Image
            width={500}
            height={400}
            src="/imgs/diagram.webp"
            alt="A diagram indicating the intersection between architecture and software development"
            className="mx-auto"
          />
          <h2 className="mt-16 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Team Members
          </h2>
          <section className="cards mt-8 flex flex-row align-center justify-center gap-8">
            <div className="card opacity-50 flex flex-col mx-auto w-full max-w-96 h-80 rounded-xl border border-zinc-700/80 bg-zinc-900/40 px-5 py-6 shadow-lg sm:px-8 sm:py-8">
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-6 w-2/5 bg-zinc-700 rounded"></div>
                <div className="h-4 w-3/5 bg-zinc-800 rounded"></div>
                <div className="h-20 w-full bg-zinc-800 rounded mt-4"></div>
              </div>
            </div>
            <div className="card flex  flex-col mx-auto w-full max-w-96 rounded-xl border border-zinc-700/80 bg-zinc-900/40 px-5 py-6 shadow-lg sm:px-8 sm:py-8">
              <h4 className="font-heading text-left text-xl text-zinc-300 sm:text-2xl">
                Antonio Ruiz
              </h4>
              <a
                href="mailto:antonio@bluelineatelier.com"
                className="text-left inline-block text-sm font-medium text-zinc-500 underline decoration-zinc-500 underline-offset-2 transition-colors hover:text-white hover:decoration-zinc-400 sm:text-base"
              >
                toti.sketches@gmail.com
              </a>
              <p className="mt-4 text-left text-base leading-relaxed text-zinc-400 sm:text-lg">
                I am a project architect with expertise in sales, real estate
                valuation, and residential projects. Highly interested in
                applying software engineering and UX design strategies within
                the architectural domain, such as modular design systems, and
                parametric design.
              </p>
            </div>
            <div className="card opacity-50 flex flex-col mx-auto w-full max-w-96 h-80 rounded-xl border border-zinc-700/80 bg-zinc-900/40 px-5 py-6 shadow-lg sm:px-8 sm:py-8">
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-6 w-2/5 bg-zinc-700 rounded"></div>
                <div className="h-4 w-3/5 bg-zinc-800 rounded"></div>
                <div className="h-20 w-full bg-zinc-800 rounded mt-4"></div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
