"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { forceRefreshStrapiProjects } from "@/app/portfolio/actions";

export function RetryButton({
  label = "Retry",
  className = "",
  hardReload = false,
}: {
  label?: string;
  className?: string;
  /**
   * Clears the in-memory Strapi snapshot + invalidates the tagged fetch cache,
   * then reloads the document. Use when `router.refresh()` alone does nothing
   * (e.g. empty cached projects list).
   */
  hardReload?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        if (hardReload) {
          setPending(true);
          try {
            await forceRefreshStrapiProjects();
          } catch (e) {
            console.error(e);
          }
          window.location.reload();
          return;
        }
        router.refresh();
      }}
      className={
        className ||
        "mt-4 rounded border border-zinc-500 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-700"
      }
    >
      {pending ? "…" : label}
    </button>
  );
}
