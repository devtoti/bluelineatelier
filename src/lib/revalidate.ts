/**
 * ISR interval (seconds) for `fetch(..., { next: { revalidate } })`.
 * Route files must use the same value as a **numeric literal** for
 * `export const revalidate` — Next.js does not allow importing this constant there.
 */
export const REVALIDATE_MS = 120;
