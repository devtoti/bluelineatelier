export default function Loading() {
  return (
    <div className="front-cover relative min-h-[100svh] h-svh max-h-svh w-full min-w-0 max-w-full font-sans overflow-hidden">
      <div className="relative z-10 mx-auto min-h-svh max-w-2xl px-6 py-12 flex flex-col items-center justify-center text-zinc-300">
        <div className="h-10 w-10 rounded-full border border-zinc-600/60 border-t-zinc-200 animate-spin" />
        <p className="mt-5 text-sm text-zinc-400">Loading…</p>
      </div>
    </div>
  );
}

