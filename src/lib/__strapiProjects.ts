import { STRAPI_STATIC_REVALIDATE } from "./revalidate";
import strapiProjectsFallbackJson from "@/data/strapi-projects-fallback.json";

export type StrapiProjectsResponse = {
  data: StrapiProjectNode[];
};

export type StrapiProjectNode = {
  id?: number;
  documentId?: string;
  attributes?: Record<string, unknown>;
  [key: string]: unknown;
};

/* -------------------------------------------------------------------------- */
/* Pure helpers (no I/O)                                                       */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Env (no HTTP, no Next fetch cache)                                          */
/* -------------------------------------------------------------------------- */

/** Strapi origin from env; does not perform network I/O. */
export function readStrapiEnvBaseUrl(): string {
  const isAccessingProductionStrapi = false;
  if (isAccessingProductionStrapi || process.env.NODE_ENV === "production") {
    return String(process.env.NEXT_PUBLIC_STRAPI_URL);
  }
  return "http://localhost:1337";
}

/** API token from env; does not perform network I/O. */
export function readStrapiEnvApiToken(): string {
  const token =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_STRAPI_DEV_API_TOKEN
      : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (!token) throw new Error("Strapi API token is not defined");
  return token;
}

/* -------------------------------------------------------------------------- */
/* Strapi list HTTP — Next.js Data Cache (tag / deploy; no time-based ISR)      */
/* -------------------------------------------------------------------------- */

/** Strapi list `fetch` uses {@link STRAPI_STATIC_REVALIDATE} (tag / deploy invalidation only). */
export const STRAPI_PROJECTS_CACHE_TAG = "strapi-projects";
const STRAPI_PROJECTS_DEBUG_CACHE =
  process.env.STRAPI_PROJECTS_DEBUG_CACHE === "true";

/**
 * Single GET `/api/projects?populate=*` through Next `fetch` with `force-cache`,
 * {@link STRAPI_STATIC_REVALIDATE}, and {@link STRAPI_PROJECTS_CACHE_TAG}.
 */
async function fetchStrapiProjectsListCached(): Promise<StrapiProjectsResponse> {
  const baseUrl = readStrapiEnvBaseUrl();
  const apiToken = readStrapiEnvApiToken();

  const res = await fetch(`${baseUrl}/api/projects?populate=*`, {
    cache: "force-cache",
    next: {
      revalidate: STRAPI_STATIC_REVALIDATE,
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

  const body = (await res.json()) as StrapiProjectsResponse;
  if (!Array.isArray(body.data) || body.data.length === 0) {
    throw new Error(
      "[strapiProjects] Strapi returned zero projects; expected a non-empty list",
    );
  }
  return body;
}

const GET_STRAPI_PROJECTS_CACHED_MAX_ATTEMPTS = 3;
const GET_STRAPI_PROJECTS_CACHED_RETRY_DELAY_MS = 5000;

/** Same Lambda / Node process — survives between warm requests. */
let memoryLastGoodProjects: StrapiProjectsResponse | null = null;

const LAST_GOOD_TMP_FILE = "strapi-projects-last-good.json";

function persistLastGoodMemory(body: StrapiProjectsResponse): void {
  memoryLastGoodProjects = body;
}

async function persistLastGoodTmp(body: StrapiProjectsResponse): Promise<void> {
  try {
    const { writeFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    await writeFile(
      join("/tmp", LAST_GOOD_TMP_FILE),
      JSON.stringify(body),
      "utf8",
    );
  } catch {
    // Edge runtime, read-only FS, etc.
  }
}

async function readLastGoodTmp(): Promise<StrapiProjectsResponse | null> {
  try {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const raw = await readFile(join("/tmp", LAST_GOOD_TMP_FILE), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as StrapiProjectsResponse).data) &&
      (parsed as StrapiProjectsResponse).data.length > 0
    ) {
      return parsed as StrapiProjectsResponse;
    }
  } catch {
    // missing file or invalid JSON
  }
  return null;
}

/** Non-empty `data` from `src/data/strapi-projects-fallback.json` — cold-start safety when Strapi is down. */
function readBundledLastGood(): StrapiProjectsResponse | null {
  const data = (
    strapiProjectsFallbackJson as { data?: StrapiProjectNode[] }
  ).data;
  if (Array.isArray(data) && data.length > 0) {
    return { data };
  }
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Loads the full project list via {@link fetchStrapiProjectsListCached} with retries.
 * Uses Next Data Cache + tag revalidation — not a live `no-store` request.
 *
 * If Strapi is unavailable after retries, returns a **last-good** list when possible:
 * 1) in-memory snapshot from a prior successful fetch in this process
 * 2) `/tmp` JSON written on last success (warm serverless instances)
 * 3) non-empty `src/data/strapi-projects-fallback.json` (commit a snapshot for cold starts)
 */
export async function getStrapiProjectsCached(): Promise<StrapiProjectsResponse> {
  let lastError: unknown;
  for (
    let attempt = 1;
    attempt <= GET_STRAPI_PROJECTS_CACHED_MAX_ATTEMPTS;
    attempt++
  ) {
    try {
      const res = await fetchStrapiProjectsListCached();
      persistLastGoodMemory(res);
      void persistLastGoodTmp(res);
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < GET_STRAPI_PROJECTS_CACHED_MAX_ATTEMPTS) {
        await sleep(GET_STRAPI_PROJECTS_CACHED_RETRY_DELAY_MS);
      }
    }
  }

  if (
    memoryLastGoodProjects &&
    memoryLastGoodProjects.data.length > 0
  ) {
    console.warn(
      "[strapiProjects] list fetch failed; serving in-memory last-good snapshot",
      lastError instanceof Error ? lastError.message : lastError,
    );
    return memoryLastGoodProjects;
  }

  const fromTmp = await readLastGoodTmp();
  if (fromTmp) {
    persistLastGoodMemory(fromTmp);
    console.warn(
      "[strapiProjects] list fetch failed; serving /tmp last-good snapshot",
      lastError instanceof Error ? lastError.message : lastError,
    );
    return fromTmp;
  }

  const bundled = readBundledLastGood();
  if (bundled) {
    persistLastGoodMemory(bundled);
    console.warn(
      "[strapiProjects] list fetch failed; serving bundled strapi-projects-fallback.json",
      lastError instanceof Error ? lastError.message : lastError,
    );
    return bundled;
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error(
    `getStrapiProjectsCached failed after ${GET_STRAPI_PROJECTS_CACHED_MAX_ATTEMPTS} attempts: ${String(lastError)}`,
  );
}

/* -------------------------------------------------------------------------- */
/* Cache invalidation hooks                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Placeholder for any pre-`revalidateTag` side effects. Pair with
 * `revalidateTag(STRAPI_PROJECTS_CACHE_TAG)` when forcing a fresh Strapi list.
 */
export function prepareStrapiProjectsTagRevalidation(): void {
  // No-op: reserved for future client/local invalidation before tag revalidation.
}
