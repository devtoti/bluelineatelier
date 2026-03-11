import { cache } from "react";
import { revalidatePath } from "next/cache";

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
  // Set baseUrl based on NODE_ENV
  const isAccessingProductionStrapi = false;
  let baseUrl: string | undefined;
  if (isAccessingProductionStrapi || process.env.NODE_ENV === "production") {
    baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  } else {
    baseUrl = "http://localhost:1337";
  } 
  const apiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (!apiToken) {
    throw new Error("NEXT_PUBLIC_STRAPI_API_TOKEN is not defined");
  }
  try {
    const res = await fetch(`${baseUrl}/api/projects?populate=*`, {
      // In dev, no cache so hot reload/refresh always sees latest Strapi data
      next:
        process.env.NODE_ENV === "development"
          ? { revalidate: 0 }
          : { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
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

/**
 * Manually revalidate all portfolio-related pages that depend on Strapi data.
 * Call this from a Server Action or Route Handler after Strapi content changes.
 */
export async function revalidatePortfolioPaths() {
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
