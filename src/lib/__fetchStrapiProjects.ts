import {
  STRAPI_PROJECTS_CACHE_TAG,
  type StrapiProjectNode,
  type StrapiProjectsResponse,
} from "@/lib/__strapiProjects";
import { REVALIDATE_MS } from "@/lib/revalidate";

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

export async function fetchStrapiProjects(): Promise<StrapiProjectsResponse> {
  try {
    const baseUrl = getStrapiBaseUrl().replace(/\/$/, "");
    if (!baseUrl) return { data: [] };

    const apiToken = getStrapiApiToken();
    if (!apiToken) return { data: [] };

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

    const text = await res.text();
    const parsed = parseStrapiJson(text, res);
    if (!parsed || typeof parsed !== "object") return { data: [] };

    const data = (parsed as { data?: unknown }).data;
    return {
      data: Array.isArray(data) ? (data as StrapiProjectNode[]) : [],
    };
  } catch {
    return { data: [] };
  }
}

async function fetchStrapiProjectByPcodeSegment(
  baseUrl: string,
  headers: HeadersInit,
  segment: string,
): Promise<unknown> {
  const stripped = segment.replace(/^0+/, "") || "0";
  const twoDigit =
    stripped.length === 1 ? `0${stripped}` : stripped.padStart(2, "0");
  const variants = [...new Set([segment, stripped, twoDigit])];

  for (const v of variants) {
    const url = `${baseUrl}/api/projects?populate=*&filters[pcode][$eq]=${encodeURIComponent(v)}`;
    const res = await fetch(url, { headers });
    const text = await res.text();
    const parsed = parseStrapiJson(text, res);
    if (!parsed || typeof parsed !== "object") continue;

    const body = parsed as { data?: unknown[] };
    const first = body?.data?.[0];
    if (first != null) return { data: first };
  }
  return null;
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
          revalidate: REVALIDATE_MS,
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
      const byPcode = await fetchStrapiProjectByPcodeSegment(
        baseUrl,
        headers,
        id,
      );
      if (byPcode) return byPcode;
      return null;
    }

    const res = await fetch(
      `${baseUrl}/api/projects/${encodeURIComponent(id)}?populate=*`,
      { headers },
    );
    const text = await res.text();
    const parsed = parseStrapiJson(text, res);
    if (parsed != null) return parsed;

    if (res.status === 404) {
      const byPcode = await fetchStrapiProjectByPcodeSegment(
        baseUrl,
        headers,
        id,
      );
      if (byPcode) return byPcode;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}
