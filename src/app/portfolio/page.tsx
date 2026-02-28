"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

function getTimeLeft(endDate: Date) {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export default function Portfolio() {
  const launchDay = new Date("2026-03-08T00:00:00-06:00");
  const { days, hours, minutes, seconds } = useCountdown(launchDay);

  return (
    <div
      className="relative min-h-[100svh] font-sans overflow-hidden"
      style={{ backgroundColor: "#0C1222" }}
    >
      <div className="portfolio-grain" aria-hidden />
      <div className="portfolio-grid" aria-hidden />
      <div className="relative z-10 mx-auto min-h-svh h-full max-w-4xl text-center px-6 py-16">
        <div className="flex justify-start pl-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            ← Back home
          </Link>
        </div>

        <div className="blueprint-container mt-2 min-w-64 h-auto flex flex-col align-center justify-center  bg-black/10 p-8  mb-12 h-full">
          <span className="deco"></span>
          <span className="deco"></span>
          <span className="deco"></span>
          <span className="deco"></span>
          <span className="bracket top-0 left-0 absolute w-5 h-5 border-t-2 border-l-2 border-white opacity-50"></span>
          <span className="bracket top-0 right-0 absolute w-5 h-5 border-t-2 border-r-2 border-white opacity-50"></span>
          <span className="bracket bottom-0 left-0 absolute w-5 h-5 border-b-2 border-l-2 border-white opacity-50"></span>
          <span className="bracket bottom-0 right-0 absolute w-5 h-5 border-b-2 border-r-2 border-white opacity-50"></span>

          <h1 className="mt-8 font-heading text-3xl font-bold text-blue-400">
            Antonio Ruiz
          </h1>
          <h3 className="text-lg font-regular text-gray-300 ">
            Architecture Portfolio 2026
          </h3>
          <p className="mb-2 mt-8 max-w-[60ch] mx-auto text-center text-md font-medium tracking-wider text-gray-300">
            Architect during the day, software developer during the night.{" "}
            <br></br>
            <span className="text-blue-300">
              I apply software engineering and UX design solutions into the
              architectural domain.
            </span>{" "}
            I leverage parametric design and modern computational techniques
            throughout all project phases.
          </p>
          <p className="mb-2 mt-8 text-center text-sm font-medium uppercase tracking-wider text-gray-200">
            Web Version Launching 8th March, 2026
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <div className="flex flex-col items-center">
              <span className="font-heading text-3xl font-bold tabular-nums text-gray-200 sm:text-4xl">
                {String(days).padStart(2, "0")}
              </span>
              <span className="mt-1 text-xs text-zinc-400">days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading text-3xl font-bold tabular-nums text-gray-200 sm:text-4xl">
                {String(hours).padStart(2, "0")}
              </span>
              <span className="mt-1 text-xs text-zinc-400">hours</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading text-3xl font-bold tabular-nums text-gray-200 sm:text-4xl">
                {String(minutes).padStart(2, "0")}
              </span>
              <span className="mt-1 text-xs text-zinc-400">minutes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading text-3xl font-bold tabular-nums text-gray-200 sm:text-4xl">
                {String(seconds).padStart(2, "0")}
              </span>
              <span className="mt-1 text-xs text-zinc-400">seconds</span>
            </div>
          </div>
          <Image
            src="/imgs/thumbnail.webp"
            alt="A handmade perspective drawing"
            width={300}
            height={300}
            className="mx-auto opacity-50 mt-8"
          />
          <div className="mt-10 w-full flex flex-col gap-4 sm:flex-row sm:gap-6 sm:justify-between">
            <a
              href="/docs/antonio-ruiz-portfolio-architecture.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center border border-zinc-600 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 rounded-none min-w-[220px] min-h-[48px]"
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
            <a
              href="/docs/antonio-ruiz-architect-cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center border border-zinc-600 bg-transparent px-6 py-3 text-sm font-medium text-gray-400 transition-colors hover:border-zinc-300 hover:bg-gray-500/20 hover:text-gray-200 rounded-none min-w-[220px] min-h-[48px]"
              style={{ minWidth: 0 }}
            >
              <span className="truncate">Architecture CV</span>
              <svg
                className="ml-2 h-5 w-5 flex-shrink-0 text-gray-400 hover:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#9CA3AF"
                strokeWidth={1.7}
                aria-hidden="true"
              >
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M15 3h6m0 0v6m0-6L10 14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </a>
            <a
              href="/docs/antonio-ruiz-frontend-cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center border border-zinc-600 bg-transparent px-6 py-3 text-sm font-medium text-gray-400 transition-colors hover:border-zinc-300 hover:bg-gray-500/20 hover:text-gray-200 rounded-none min-w-[220px] min-h-[48px]"
              style={{ minWidth: 0 }}
            >
              <svg
                className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400 hover:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#9CA3AF"
                strokeWidth={1.7}
                aria-hidden="true"
              >
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M15 3h6m0 0v6m0-6L10 14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <span className="truncate">Software Developer CV</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
