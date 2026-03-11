"use client";

import { useRouter } from "next/navigation";

export function RetryButton({
  label = "Retry",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className={
        className ||
        "mt-4 rounded border border-zinc-500 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-700"
      }
    >
      {label}
    </button>
  );
}
