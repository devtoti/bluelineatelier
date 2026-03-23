import {
  STRAPI_PROJECTS_CACHE_TAG,
  type StrapiProjectNode,
  type StrapiProjectsResponse,
} from "@/lib/__strapiProjects";
import { STRAPI_STATIC_REVALIDATE } from "@/lib/revalidate";

function getStrapiBaseUrl(): string {
  const isAccessingProductionStrapi = false;
  if (isAccessingProductionStrapi || process.env.NODE_ENV === "production") {
    return String(process.env.NEXT_PUBLIC_STRAPI_URL ?? "");
  }
  return "http://localhost:1337";
}

function getStrapiApiToken(): string | null {
  const token =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_STRAPI_DEV_API_TOKEN
      : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  return token && token.length > 0 ? token : null;
}

function isLikelyPcodeSlug(segment: string): boolean {
  return /^\d{1,6}$/.test(segment);
}

/** Strapi returns JSON; proxies/errors often return HTML — never throw from JSON.parse. */
function parseStrapiJson(text: string, res: Response): unknown | null {
  if (!res.ok || text.trimStart().startsWith("<")) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

const strapiProjectsListCache = {
  cache: "force-cache" as const,
  next: {
    revalidate: STRAPI_STATIC_REVALIDATE,
    tags: [STRAPI_PROJECTS_CACHE_TAG],
  },
};

async function fetchStrapiProjectsInternal(
  strict: boolean,
): Promise<StrapiProjectsResponse> {
  const baseUrl = getStrapiBaseUrl().replace(/\/$/, "");
  if (!baseUrl) {
    if (strict) {
      throw new Error(
        "[portfolio] NEXT_PUBLIC_STRAPI_URL is required to pre-render project routes",
      );
    }
    return { data: [] };
  }

  const apiToken = getStrapiApiToken();
  if (!apiToken) {
    if (strict) {
      throw new Error(
        "[portfolio] Strapi API token is required to pre-render project routes",
      );
    }
    return { data: [] };
  }

  const res = await fetch(`${baseUrl}/api/projects?populate=*`, {
    ...strapiProjectsListCache,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  const text = await res.text();
  const parsed = parseStrapiJson(text, res);

  if (!parsed || typeof parsed !== "object") {
    if (strict) {
      throw new Error(
        `[portfolio] Strapi project list failed (${res.status}) or returned non-JSON`,
      );
    }
    return { data: [] };
  }

  const data = (parsed as { data?: unknown }).data;
  const arr = Array.isArray(data) ? (data as StrapiProjectNode[]) : [];

  if (strict && arr.length === 0) {
    throw new Error(
      "[portfolio] Strapi returned zero projects; cannot pre-render /portfolio/projects/[id]",
    );
  }

  return { data: arr };
}

/** Resilient list fetch for runtime; returns empty on failure. */
export async function fetchStrapiProjects(): Promise<StrapiProjectsResponse> {
  try {
    return await fetchStrapiProjectsInternal(false);
  } catch {
    return { data: [] };
  }
}

/**
 * Fails loudly — use from `generateStaticParams` when build must not ship without projects.
 */
export async function fetchStrapiProjectsStrict(): Promise<StrapiProjectsResponse> {
  return fetchStrapiProjectsInternal(true);
}

/** Unique pcode strings to try with Strapi `filters[pcode][$eq]` (order preserved). */
function expandPcodeFilterValues(segments: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const segment of segments) {
    const stripped = segment.replace(/^0+/, "") || "0";
    const twoDigit =
      stripped.length === 1 ? `0${stripped}` : stripped.padStart(2, "0");
    for (const v of [segment, stripped, twoDigit]) {
      if (!seen.has(v)) {
        seen.add(v);
        out.push(v);
      }
    }
  }
  return out;
}

export type FetchStrapiProjectByPcodeResult =
  | { kind: "project"; node: unknown }
  | { kind: "not_found" }
  | { kind: "unavailable" };

/**
 * Loads one project by pcode via `GET /api/projects?filters[pcode][$eq]=...&populate=*`.
 * Does not depend on the full project list. Uses the same Data Cache / tags as other Strapi fetches.
 */
export async function fetchStrapiProjectByPcode(
  pcodeVariants: string[],
): Promise<FetchStrapiProjectByPcodeResult> {
  try {
    const baseUrl = getStrapiBaseUrl().replace(/\/$/, "");
    if (!baseUrl) return { kind: "unavailable" };

    const apiToken = getStrapiApiToken();
    if (!apiToken) return { kind: "unavailable" };

    const fetchOpts = {
      cache: "force-cache" as const,
      next: {
        revalidate: STRAPI_STATIC_REVALIDATE,
        tags: [STRAPI_PROJECTS_CACHE_TAG],
      },
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    };

    let sawTransportOrParseFailure = false;

    for (const v of expandPcodeFilterValues(pcodeVariants)) {
      const url = `${baseUrl}/api/projects?populate=*&filters[pcode][$eq]=${encodeURIComponent(v)}`;
      const res = await fetch(url, fetchOpts);
      const text = await res.text();
      const parsed = parseStrapiJson(text, res);

      if (!parsed || typeof parsed !== "object") {
        if (!res.ok || text.trimStart().startsWith("<")) {
          sawTransportOrParseFailure = true;
        }
        continue;
      }

      const body = parsed as { data?: unknown[] };
      const list = body?.data;
      if (Array.isArray(list) && list.length === 0) {
        continue;
      }
      if (Array.isArray(list) && list[0] != null) {
        return { kind: "project", node: list[0] };
      }
    }

    return sawTransportOrParseFailure
      ? { kind: "unavailable" }
      : { kind: "not_found" };
  } catch (error) {
    console.error("fetchStrapiProjectByPcode:", error);
    return { kind: "unavailable" };
  }
}

/**
 * Loads a single project by Strapi document id (or legacy numeric id).
 * Always calls `GET /api/projects/:documentId` — use after resolving pcode → id from the list.
 */
export async function fetchStrapiProjectByDocumentId(
  documentId: string,
): Promise<{ data?: unknown } | null> {
  try {
    const baseUrl = getStrapiBaseUrl().replace(/\/$/, "");
    if (!baseUrl) return null;

    const apiToken = getStrapiApiToken();
    if (!apiToken) return null;

    const res = await fetch(
      `${baseUrl}/api/projects/${encodeURIComponent(documentId)}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        cache: "force-cache",
        next: {
          revalidate: STRAPI_STATIC_REVALIDATE,
          tags: [STRAPI_PROJECTS_CACHE_TAG],
        },
      },
    );
    const text = await res.text();
    const parsed = parseStrapiJson(text, res);
    if (parsed != null) return parsed as { data?: unknown };
    return null;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}

export async function fetchStrapiProjectById(
  id: string,
): Promise<{ data?: unknown } | null> {
  try {
    const baseUrl = getStrapiBaseUrl().replace(/\/$/, "");
    if (!baseUrl) return null;

    const apiToken = getStrapiApiToken();
    if (!apiToken) return null;

    const headers = {
      Authorization: `Bearer ${apiToken}`,
    };

    if (isLikelyPcodeSlug(id)) {
      const byPcode = await fetchStrapiProjectByPcode([id]);
      if (byPcode.kind === "project") return { data: byPcode.node };
      if (byPcode.kind === "not_found") return null;
    }

    const res = await fetch(
      `${baseUrl}/api/projects/${encodeURIComponent(id)}?populate=*`,
      { headers },
    );
    const text = await res.text();
    const parsed = parseStrapiJson(text, res);
    if (parsed != null) return parsed;

    if (res.status === 404) {
      const byPcode = await fetchStrapiProjectByPcode([id]);
      if (byPcode.kind === "project") return { data: byPcode.node };
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}
