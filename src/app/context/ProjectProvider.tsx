"use client";

import type { ReactNode } from "react";
import { ProjectContext } from "@/app/context/projectContext";
import type { StrapiProjectsResponse } from "@/lib/__strapiProjectsCore";

type ProjectProviderProps = {
  children: ReactNode;
  value: Promise<StrapiProjectsResponse> | null;
};

export function ProjectProvider({ children, value }: ProjectProviderProps) {
  return <ProjectContext value={value as unknown as StrapiProjectsResponse}>{children}</ProjectContext>;
}
