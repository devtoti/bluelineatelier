import { cacheLife } from "next/cache";
import type { StrapiProjectsResponse, StrapiProjectNode } from "./__strapiProjectsCore";
import {
  readStrapiEnvApiToken,
  readStrapiEnvBaseUrl,
} from "./__strapiProjectsCore";

export type { StrapiProjectsResponse, StrapiProjectNode } from "./__strapiProjectsCore";
export {
  toTwoDigitPcode,
  strapiProjectPcodeSlug,
  findProjectByPcode,
  readStrapiEnvBaseUrl,
  readStrapiEnvApiToken,
} from "./__strapiProjectsCore";

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

async function fetchStrapiProjectsOnce(
  fetchInit: Pick<RequestInit, "cache"> = {},
): Promise<StrapiProjectsResponse> {
  const baseUrl = readStrapiEnvBaseUrl().replace(/\/$/, "");
  if (!baseUrl.trim()) {
    throw new Error(
      "[portfolio] NEXT_PUBLIC_STRAPI_URL is required to pre-render project routes",
    );
  }
  const apiToken = readStrapiEnvApiToken();

  const res = await fetch(`${baseUrl}/api/projects?populate=*`, {
    ...fetchInit,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
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
const SLEEP_DELAY_MS =
  process.env.NODE_ENV === "development" ? 2000 : 30000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getStrapiProjects(): Promise<StrapiProjectsResponse> {
  "use cache";
  cacheLife("hours");
  await wakeStrapi();
  await sleep(SLEEP_DELAY_MS);
  const isStrapiWarmedUp = await wakeStrapi();
  if (!isStrapiWarmedUp.ok) {
    throw new Error(`Strapi is not warmed up: ${isStrapiWarmedUp.statusText}`);
  }
  let lastError: unknown;
  for (let attempt = 1; attempt <= STRAPI_MAX_ATTEMPTS; attempt++) {
    try {
      return await fetchStrapiProjectsOnce();
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
    `getStrapiProjects failed after: ${STRAPI_MAX_ATTEMPTS} attempts: ${String(lastError)}`,
  );
}

/** Warm-up ping; not cached — must return plain data (never `Response`) for RSC/cache safety. */
export async function wakeStrapi(): Promise<{ ok: boolean; statusText: string }> {
  try {
    const response = await fetch(`${readStrapiEnvBaseUrl()}/api/about`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${readStrapiEnvApiToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to wake Strapi: ${response.statusText}`);
    }
    return { ok: true, statusText: response.statusText || "OK" };
  } catch (error) {
    return {
      ok: false,
      statusText: error instanceof Error ? error.message : String(error),
    };
  }
}
