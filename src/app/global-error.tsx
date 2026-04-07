"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useEffect } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Root-level error UI when the root layout fails. Replaces `layout.tsx`, so
 * this file must define `<html>` and `<body>` and load global styles.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/global-error
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const fontClassNames = `${geistSans.variable} ${geistMono.variable} font-sans antialiased`;

  return (
    <html lang="en">
      <body className={fontClassNames}>
        <div
          className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center"
          style={{ backgroundColor: "#0C1222" }}
        >
          <div className="max-w-md text-zinc-100">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-normal tracking-wide text-white sm:text-4xl">
              Something went wrong
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              A critical error occurred. You can try again or return to the
              homepage.
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
      </body>
    </html>
  );
}
