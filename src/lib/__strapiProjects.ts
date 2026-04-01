import { STRAPI_LIST_REVALIDATE_SECONDS } from "./revalidate";

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
/* Strapi list — `GET /api/projects?populate=*` (single source of truth)       */
/* -------------------------------------------------------------------------- */

/**
 * Parses Strapi JSON from `res.text()`. Throws with context on bad status,
 * HTML error pages, invalid JSON, or non-object root (Strapi uses `{ data: ... }`).
 */
function parseStrapiJson(text: string, res: Response): Record<string, unknown> {
  if (!res.ok) {
    const preview = text.replace(/\s+/g, " ").trim().slice(0, 240);
    throw new Error(
      `[strapi] HTTP ${res.status}${preview ? `: ${preview}` : ""}`,
    );
  }

  const trimmed = text.trimStart();
  if (trimmed.startsWith("<")) {
    throw new Error(
      "[strapi] Body looks like HTML, not JSON (often a proxy or error page)",
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`[strapi] JSON.parse failed: ${msg}`);
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(
      "[strapi] Expected a JSON object at root (e.g. { data: [...] })",
    );
  }

  return parsed as Record<string, unknown>;
}

const strapiListFetchOptions = {
  cache: "force-cache" as const,
  next: {
    revalidate: STRAPI_LIST_REVALIDATE_SECONDS,
  },
};

/**
 * `GET /api/projects?populate=*` — single attempt. Used directly for static
 * generation / TOC; {@link getStrapiProjects} wraps this with retries.
 */
export async function fetchStrapiProjects(): Promise<StrapiProjectsResponse> {
  const baseUrl = readStrapiEnvBaseUrl().replace(/\/$/, "");
  if (!baseUrl.trim()) {
    throw new Error(
      "[portfolio] NEXT_PUBLIC_STRAPI_URL is required to pre-render project routes",
    );
  }
  const apiToken = readStrapiEnvApiToken();

  const res = await fetch(`${baseUrl}/api/projects?populate=*`, {
    ...strapiListFetchOptions,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  const text = await res.text();
  const parsed = parseStrapiJson(text, res);
  const data = parsed.data;
  const arr = Array.isArray(data) ? (data as StrapiProjectNode[]) : [];

  if (arr.length === 0) {
    throw new Error(
      "[portfolio] Strapi returned zero projects; expected a non-empty list",
    );
  }

  return { data: arr };
}

const STRAPI_MAX_ATTEMPTS = 3;
const STRAPI_DELAY_MS = 3000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Same list with retries for transient failures (runtime pages, server actions).
 */
export async function getStrapiProjects(): Promise<StrapiProjectsResponse> {
  let lastError: unknown;
  for (
    let attempt = 1;
    attempt <= STRAPI_MAX_ATTEMPTS;
    attempt++
  ) {
    try {
      return await fetchStrapiProjects();
    } catch (err) {
      lastError = err;
      if (attempt < STRAPI_MAX_ATTEMPTS) {
        await sleep(STRAPI_DELAY_MS);
      }
    }
  }
  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error(
    `getStrapiProjects failed after ${STRAPI_MAX_ATTEMPTS} attempts: ${String(lastError)}`,
  );
}
