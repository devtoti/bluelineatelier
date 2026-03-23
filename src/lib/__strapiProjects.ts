import { REVALIDATE_MS } from "./revalidate";

export type StrapiProjectsResponse = {
  data: StrapiProjectNode[];
};

export type StrapiProjectNode = {
  id?: number;
  documentId?: string;
  attributes?: Record<string, unknown>;
  [key: string]: unknown;
};

export function toTwoDigitPcode(value: string | number | undefined): string {
  if (value == null) return "00";
  const s = String(value).replace(/^0+/, "") || "0";
  return s.length === 1 ? `0${s}` : s.padStart(2, "0");
}

export function strapiProjectPcodeSlug(node: StrapiProjectNode): string {
  const attrs = node.attributes ?? (node as Record<string, unknown>);
  const raw = attrs?.pcode ?? attrs?.code ?? node.id;
  if (typeof raw === "string" || typeof raw === "number") {
    return toTwoDigitPcode(raw);
  }
  return toTwoDigitPcode(undefined);
}

const PROJECTS_IN_MEMORY_SNAPSHOT_TTL_MS = 45 * 60 * 1000;

/** Use with `REVALIDATE_MS` on `fetch(..., { next: { revalidate } })` and `export const revalidate` for portfolio pages that list projects. */
export const STRAPI_PROJECTS_CACHE_TAG = "strapi-projects";
const STRAPI_PROJECTS_DEBUG_CACHE =
  process.env.STRAPI_PROJECTS_DEBUG_CACHE === "true";

let lastGoodProjects: StrapiProjectsResponse | null = null;
let lastGoodAtMs = 0;

let refreshInFlight: Promise<StrapiProjectsResponse> | null = null;

export function getStrapiBaseUrl(): string {
  const isAccessingProductionStrapi = false;
  if (isAccessingProductionStrapi || process.env.NODE_ENV === "production") {
    return String(process.env.NEXT_PUBLIC_STRAPI_URL);
  }
  return "http://localhost:1337";
}

export function getStrapiApiToken(): string {
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
    cache: "force-cache",
    next: {
      revalidate: REVALIDATE_MS,
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
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

/** Clears the per-instance snapshot so the next `getProjects()` hits Strapi again. */
export function clearStrapiProjectsMemoryCache(): void {
  lastGoodProjects = null;
  lastGoodAtMs = 0;
  refreshInFlight = null;
}

export async function getProjects(): Promise<StrapiProjectsResponse> {
  const now = Date.now();

  if (
    lastGoodProjects &&
    now - lastGoodAtMs >= 0 &&
    now - lastGoodAtMs < PROJECTS_IN_MEMORY_SNAPSHOT_TTL_MS
  ) {
    return lastGoodProjects;
  }

  if (lastGoodProjects) {
    try {
      return await startProjectsRefresh();
    } catch {
      return lastGoodProjects;
    }
  }

  return startProjectsRefresh();
}

function pcodeFromNode(node: StrapiProjectNode): string {
  const attrs = node?.attributes ?? (node as Record<string, unknown>);
  const raw = attrs?.pcode ?? attrs?.code ?? node?.id;
  if (raw == null) return "";
  const s = String(raw).replace(/^0+/, "") || "0";
  return s.length === 1 ? `0${s}` : s.padStart(2, "0");
}

export function findProjectByPcode(
  data: StrapiProjectNode[],
  pcodeVariants: string[],
): StrapiProjectNode | undefined {
  const set = new Set(pcodeVariants);
  return data.find((node) => set.has(pcodeFromNode(node)));
}
