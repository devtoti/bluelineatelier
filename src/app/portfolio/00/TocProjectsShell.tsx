"use client";

import { useCallback, useEffect, useState } from "react";
import { TableOfContents } from "@/components/TableOfContents";
import { fetchTocProjects } from "@/app/portfolio/actions";
import type { StrapiProjectNode } from "@/lib/__strapiProjects";

const RETRY_DELAY_MS = 10_000;

const shellClass =
  "back-cover relative min-h-[100svh] w-full font-sans overflow-hidden";
const innerClass = "relative z-10 mx-auto min-h-svh max-w-5xl px-6 py-12";

function Spinner({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`${innerClass} flex flex-col items-center justify-center gap-6 text-center`}
    >
      <div
        className="h-12 w-12 animate-spin rounded-full border-2 border-[#53A4D7] border-t-transparent"
        aria-hidden
      />
      <p className="text-zinc-300 text-sm">{label}</p>
    </div>
  );
}

export function TocProjectsShell({
  initialList,
}: {
  initialList: StrapiProjectNode[];
}) {
  const [projects, setProjects] = useState<StrapiProjectNode[]>(initialList);
  const [phase, setPhase] = useState<"ready" | "loading" | "failed">(
    initialList.length > 0 ? "ready" : "loading",
  );
  const [manualRetryBusy, setManualRetryBusy] = useState(false);

  const tryLoad = useCallback(async (): Promise<boolean> => {
    const data = await fetchTocProjects();
    if (data.length > 0) {
      setProjects(data);
      setPhase("ready");
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (initialList.length > 0) return;
    const t = setTimeout(() => {
      void (async () => {
        const ok = await tryLoad();
        if (!ok) setPhase("failed");
      })();
    }, RETRY_DELAY_MS);
    return () => clearTimeout(t);
  }, [initialList.length, tryLoad]);

  const handleManualRetry = async () => {
    setManualRetryBusy(true);
    const ok = await tryLoad();
    if (!ok) setPhase("failed");
    setManualRetryBusy(false);
  };

  if (phase === "ready" && projects.length > 0) {
    return (
      <div className={shellClass}>
        <div className={innerClass}>
          <TableOfContents projects={projects} />
        </div>
      </div>
    );
  }

  if (phase === "loading" || manualRetryBusy) {
    return (
      <div className={shellClass}>
        <Spinner
          label={manualRetryBusy ? "Retrying…" : "Loading projects…"}
        />
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <div className={innerClass}>
        <h1 className="font-heading text-xl text-white lg:text-3xl font-bold mb-2">
          Failed to load projects
        </h1>
        <p className="text-zinc-400 text-sm mb-6 max-w-md">
          Strapi did not return any projects. Check your connection or try
          again.
        </p>
        <button
          type="button"
          disabled={manualRetryBusy}
          onClick={() => void handleManualRetry()}
          className="rounded border border-zinc-500 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-700 disabled:opacity-60"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
