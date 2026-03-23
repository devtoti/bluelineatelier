import type { StrapiProjectsResponse } from "./__strapiProjects";
import { fetchStrapiProjects } from "./__fetchStrapiProjects";

export const revalidate = 120;

export async function getNewProjects(): Promise<StrapiProjectsResponse> {
  return fetchStrapiProjects();
}
