import { revalidatePath, revalidateTag } from "next/cache";

export type StrapiProjectsResponse = {
  data: StrapiProjectNode[];
};

export type StrapiProjectNode = {
  id?: number;
  attributes?: Record<string, unknown>;
  [key: string]: unknown;
};

/**
 * Fetcher for all projects from Strapi (populate=*).
 *
 * UX goal:
 * - Keep serving the last successful snapshot when Strapi is temporarily failing (e.g. 503).
 * - Persist the snapshot across cold starts via Next.js/Vercel data cache.
 * - Refresh the snapshot only every ~8 hours (default, configurable).
 *
 * Note:
 * - We still keep an in-memory snapshot per Vercel instance for extra resilience.
 * - The underlying `fetch` uses Vercel's persistent data cache, so cold starts can often be served
 *   without contacting Strapi.
 */
const PROJECTS_IN_MEMORY_SNAPSHOT_TTL_MS = 45 * 60 * 1000; // optimization for the same instance

const PROJECTS_STRAPI_FETCH_REVALIDATE_SECONDS =
  Number(process.env.STRAPI_PROJECTS_REVALIDATE_SECONDS ?? 8 * 60 * 60); // 8h default

const STRAPI_PROJECTS_CACHE_TAG = "strapi-projects";
const STRAPI_PROJECTS_DEBUG_CACHE =
  process.env.STRAPI_PROJECTS_DEBUG_CACHE === "true";

let lastGoodProjects: StrapiProjectsResponse | null = null;
let lastGoodAtMs = 0;

// Single-flight refresh (prevents stampedes within a single instance).
let refreshInFlight: Promise<StrapiProjectsResponse> | null = null;

function getStrapiBaseUrl(): string {
  // Set baseUrl based on NODE_ENV
  const isAccessingProductionStrapi = false;
  if (isAccessingProductionStrapi || process.env.NODE_ENV === "production") {
    return String(process.env.NEXT_PUBLIC_STRAPI_URL);
  }
  return "http://localhost:1337";
}

function getStrapiApiToken(): string {
  const token =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_STRAPI_DEV_API_TOKEN
      : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (!token) throw new Error("Strapi API token is not defined");
  return token;
}

async function fetchProjectsFromStrapi(): Promise<StrapiProjectsResponse> {
  const baseUrl = getStrapiBaseUrl();
  const apiToken = getStrapiApiToken();

  const t0 = Date.now();
  const res = await fetch(`${baseUrl}/api/projects?populate=*`, {
    // Persist the last successful response across cold starts.
    // Vercel will serve cached data and only revalidate after the given TTL.
    cache: "force-cache",
    next: {
      revalidate: PROJECTS_STRAPI_FETCH_REVALIDATE_SECONDS,
      // Allows `revalidatePortfolioPaths()` to force-refresh the persistent snapshot immediately.
      tags: [STRAPI_PROJECTS_CACHE_TAG],
    },
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  if (STRAPI_PROJECTS_DEBUG_CACHE) {
    const xNextjsCache = res.headers.get("x-nextjs-cache");
    const xVercelCache = res.headers.get("x-vercel-cache");
    const cacheHint =
      xVercelCache ?? xNextjsCache ?? "(no cache headers present)";
    console.log(
      `[strapiProjects] fetch /api/projects status=${res.status} dtMs=${
        Date.now() - t0
      } cache=${cacheHint}`,
    );
  }

  if (!res.ok) {
    // Preserve status code so caller can show a meaningful retry UI.
    throw new Error(`Strapi returned ${res.status}`);
  }

  return (await res.json()) as StrapiProjectsResponse;
}

function startProjectsRefresh(): Promise<StrapiProjectsResponse> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const fresh = await fetchProjectsFromStrapi();
      lastGoodProjects = fresh;
      lastGoodAtMs = Date.now();
      return fresh;
    } catch (err) {
      const cause =
        err instanceof Error ? (err.cause as unknown) : undefined;
      const code =
        cause &&
        typeof cause === "object" &&
        "code" in cause &&
        typeof (cause as { code: unknown }).code === "string"
          ? (cause as { code: string }).code
          : undefined;

      if (code === "ECONNREFUSED") {
        const baseUrl = getStrapiBaseUrl();
        throw new Error(
          `Cannot reach Strapi at ${baseUrl}. Is the Strapi server running? (e.g. npm run develop in your Strapi project)`,
          { cause: err },
        );
      }
      throw err;
    } finally {
      // Ensure single-flight is cleared even on errors.
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export async function getProjects(): Promise<StrapiProjectsResponse> {
  const now = Date.now();

  // 1) Serve fresh snapshot.
  if (
    lastGoodProjects &&
    now - lastGoodAtMs >= 0 &&
    now - lastGoodAtMs < PROJECTS_IN_MEMORY_SNAPSHOT_TTL_MS
  ) {
    return lastGoodProjects;
  }

  // 2) If we have *any* snapshot, keep serving it while we attempt refresh.
  if (lastGoodProjects) {
    try {
      // Attempt a refresh once the snapshot is stale. If Strapi is failing,
      // fall back to the last known good snapshot for this request.
      return await startProjectsRefresh();
    } catch {
      return lastGoodProjects;
    }
  }

  // 3) Cold start: no snapshot yet. Caller must handle failure (retry UI).
  return startProjectsRefresh();
}

/**
 * Manually revalidate all portfolio-related pages that depend on Strapi data.
 * Call this from a Server Action or Route Handler after Strapi content changes.
 */
export async function revalidatePortfolioPaths() {
  // Clear the in-memory snapshot so the next request re-fetches from Strapi.
  lastGoodProjects = null;
  lastGoodAtMs = 0;
  refreshInFlight = null;

  // Invalidate the persistent (cross-instance) cache for this Strapi response.
  revalidateTag(STRAPI_PROJECTS_CACHE_TAG, "max");

  revalidatePath("/portfolio");
  revalidatePath("/portfolio/00");
  revalidatePath("/portfolio/contact");
  revalidatePath("/portfolio/projects/[id]");
}

function pcodeFromNode(node: StrapiProjectNode): string {
  const attrs = node?.attributes ?? (node as Record<string, unknown>);
  const raw = attrs?.pcode ?? attrs?.code ?? node?.id;
  if (raw == null) return "";
  const s = String(raw).replace(/^0+/, "") || "0";
  return s.length === 1 ? `0${s}` : s.padStart(2, "0");
}

/**
 * Find a single project by normalized pcode from the pre-fetched list.
 * Accepts both "01" and "1" style ids via pcodeVariants.
 */
export function findProjectByPcode(
  data: StrapiProjectNode[],
  pcodeVariants: string[],
): StrapiProjectNode | undefined {
  const set = new Set(pcodeVariants);
  return data.find((node) => set.has(pcodeFromNode(node)));
}
