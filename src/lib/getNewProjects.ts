import type { StrapiProjectsResponse } from "./__strapiProjects";
import { fetchStrapiProjects } from "./__fetchStrapiProjects";

export async function getNewProjects(): Promise<StrapiProjectsResponse> {
  return fetchStrapiProjects();
}
