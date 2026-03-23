"use client";
import { createContext, useContext } from "react";
import type { StrapiProjectsResponse } from "@/lib/__strapiProjects";

export const ProjectContext = createContext<StrapiProjectsResponse | null>(
  null,
);

export default function useProjects() {
  return useContext(ProjectContext);
}
