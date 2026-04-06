/**
 * Client-safe Strapi types and pure helpers (no `next/cache`).
 * Import this from Client Components and shared nav utilities.
 */

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

function strapiLocal(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.STRAPI_USE_LOCAL === "1"
  );
}

export function readStrapiEnvBaseUrl(): string {
  const url = strapiLocal()
    ? (process.env.STRAPI_LOCAL_URL ?? "http://localhost:1337")
    : process.env.NEXT_PUBLIC_STRAPI_URL;
  return String(url).replace(/\/$/, "");
}

export function readStrapiEnvApiToken(): string {
  const token = strapiLocal()
    ? process.env.NEXT_PUBLIC_STRAPI_DEV_API_TOKEN
    : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (!token) throw new Error("Strapi API token is not defined");
  return token;
}
