export default function PrintablePortfolio() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans print:p-0">
      <h1 className="text-2xl font-bold text-zinc-900">Portfolio</h1>
      <p className="mt-4 text-zinc-600">Printable portfolio content.</p>
      <p className="mt-8 text-sm text-zinc-500">
        Use your browser&apos;s Print (Ctrl/Cmd+P) to save as PDF.
      </p>
    </div>
  );
}
