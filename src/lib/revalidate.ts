/**
 * Short ISR window (seconds) for Strapi-backed code paths that are not fully static
 * (e.g. `getProjects()` in server actions).
 */
export const REVALIDATE_MS = 3600;

/**
 * Static Strapi data: no time-based ISR; cache until redeploy or `revalidateTag`.
 * Use in `fetch(..., { next: { revalidate } })` — import this constant there.
 *
 * For `export const revalidate` in route files, Next.js requires a **literal**
 * (`false` or a number); copy `false` from portfolio pages that use static Strapi.
 */
export const STRAPI_STATIC_REVALIDATE = false as const;
