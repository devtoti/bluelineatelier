/** Normalizes a project code segment to two digits (e.g. `4` → `04`). */
export function normalizePcode(code: string): string {
  const n = code.replace(/^0+/, "") || "0";
  return n.length === 1 ? `0${n}` : n.padStart(2, "0");
}

export function enforcePortfolioStaticParams(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.CI === "true"
  );
}
