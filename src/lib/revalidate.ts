/**
 * Strapi project list (`/api/projects?populate=*`): no time-based ISR — cache until
 * `revalidateTag(STRAPI_PROJECTS_CACHE_TAG)` or redeploy. Same policy for
 * `fetchStrapiProjects()` and `getStrapiProjectsCached()`.
 */
export const STRAPI_STATIC_REVALIDATE = false as const;

/**
 * 3600 **seconds** (≈1 hour). Not used by list fetches (they use
 * {@link STRAPI_STATIC_REVALIDATE}). Kept as a correctly named reference if you add
 * a separate time-based `fetch` later.
 */
export const STRAPI_LIST_REVALIDATE_SECONDS = 3600;
