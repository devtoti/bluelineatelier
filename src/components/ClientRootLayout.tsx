"use client";

import Link from "next/link";
import { Suspense, useSyncExternalStore } from "react";
import Navbar from "@/components/Navbar";

type ClientRootLayoutProps = {
  children: React.ReactNode;
};

/**
 * Client-only year via `useSyncExternalStore`; wrapped in `Suspense` per
 * https://nextjs.org/docs/messages/next-prerender-current-time
 */
function CopyrightYear() {
  const year = useSyncExternalStore(
    () => () => {},
    () => String(new Date().getFullYear()),
    () => "",
  );
  return <>{year}</>;
}

/** Navbar + footer for routes under `app/(main)/` only. */
export function ClientRootLayout({ children }: ClientRootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <div
        className="flex flex-1 flex-col font-sans"
        style={{ backgroundColor: "#0C1222" }}
      >
        <Navbar />
        {children}
      </div>
      <footer
        className="border-t border-zinc-800 bg-[#0C1222] px-6 py-4 text-center text-sm text-zinc-500"
        role="contentinfo"
      >
        <p suppressHydrationWarning>
          ©{" "}
          <Suspense
            fallback={
              <span className="inline-block min-w-[2ch]" aria-hidden />
            }
          >
            <CopyrightYear />
          </Suspense>{" "}
          <Link
            href="/"
            className="text-zinc-400 transition-colors hover:text-white"
          >
            Blueline Atelier
          </Link>
        </p>
      </footer>
    </div>
  );
}
