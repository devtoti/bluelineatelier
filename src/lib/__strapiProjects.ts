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

/** Use with `fetch(..., { next: { revalidate, tags } })` — portfolio list fetch uses `STRAPI_STATIC_REVALIDATE` from `@/lib/revalidate`; `getProjects()` still uses `REVALIDATE_MS`. */
export const STRAPI_PROJECTS_CACHE_TAG = "strapi-projects";
const STRAPI_PROJECTS_DEBUG_CACHE =
  process.env.STRAPI_PROJECTS_DEBUG_CACHE === "true";

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
      `[strapiProjects] fetch /api/projects status=${res.status} cache=${cacheHint}`,
    );
  }

  if (!res.ok) {
    throw new Error(`Strapi returned ${res.status}`);
  }

  return (await res.json()) as StrapiProjectsResponse;
}

/** Clears the per-instance snapshot so the next `getProjects()` hits Strapi again. */
export function clearStrapiProjectsMemoryCache(): void {
  // No-op: in-memory project snapshot caching has been removed.
}

const GET_PROJECTS_MAX_ATTEMPTS = 3;
const GET_PROJECTS_RETRY_DELAY_MS = 5000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getProjects(): Promise<StrapiProjectsResponse> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= GET_PROJECTS_MAX_ATTEMPTS; attempt++) {
    try {
      return await fetchProjectsFromStrapi();
    } catch (err) {
      lastError = err;
      if (attempt < GET_PROJECTS_MAX_ATTEMPTS) {
        await sleep(GET_PROJECTS_RETRY_DELAY_MS);
      }
    }
  }
  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error(
    `getProjects failed after ${GET_PROJECTS_MAX_ATTEMPTS} attempts: ${String(lastError)}`,
  );
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
