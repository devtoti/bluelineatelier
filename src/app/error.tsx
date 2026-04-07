"use client";

import Link from "next/link";
import { useEffect } from "react";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Root segment error boundary: catches errors in pages and nested layouts
 * beneath `layout.tsx` (including Server Component errors). Does not replace
 * the root layout, so `global-error.tsx` is still required for root-layout
 * failures.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center"
      style={{ backgroundColor: "#0C1222" }}
    >
      <div className="max-w-md text-zinc-100">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-normal tracking-wide text-white sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          This page could not be loaded. You can try again or go back home.
        </p>
        {error.digest ? (
          <p className="mt-6 font-mono text-xs text-zinc-500">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="rounded border border-zinc-600 bg-zinc-900/60 px-5 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-500 hover:bg-zinc-800/80"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
