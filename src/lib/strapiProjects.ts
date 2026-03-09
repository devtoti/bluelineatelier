import { cache } from "react";

export type StrapiProjectsResponse = {
  data: StrapiProjectNode[];
};

export type StrapiProjectNode = {
  id?: number;
  attributes?: Record<string, unknown>;
  [key: string]: unknown;
};

/**
 * Cached fetcher: all projects from Strapi (populate=*).
 * Call when user lands on /portfolio so data is loaded once;
 * project pages then read from this same cache.
 */
export const getProjects = cache(async (): Promise<StrapiProjectsResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not defined");
  }
  try {
    const res = await fetch(`${baseUrl}/api/projects?populate=*`, {
      // In dev, no cache so hot reload/refresh always sees latest Strapi data
      next: process.env.NODE_ENV === "development" ? { revalidate: 0 } : { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Strapi returned ${res.status}`);
    }
    const json = await res.json();
    return json as StrapiProjectsResponse;
  } catch (err) {
    const cause = err instanceof Error ? err.cause : undefined;
    const code = cause && typeof cause === "object" && "code" in cause ? (cause as { code: string }).code : undefined;
    if (code === "ECONNREFUSED") {
      throw new Error(
        `Cannot reach Strapi at ${baseUrl}. Is the Strapi server running? (e.g. npm run develop in your Strapi project)`,
        { cause: err },
      );
    }
    throw err;
  }
});

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
