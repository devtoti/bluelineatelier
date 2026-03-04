export type ProjectScale =
  | "element"
  | "architectural"
  | "urban"
  | "landscape"
  | "other";

export type ProjectStatus = "completed" | "in progress" | "on hold" | "concept";

export type ProjectDomain =
  | "architecture"
  | "illustration"
  | "programming"
  | "other";

export type Overview = {
  context: string;
  challenges: string;
  approach: string;
  results: string;
  learnings?: string;
  nextSteps?: string;
};

export type InterventionData = {
  yearStarted: number;
  yearCompleted?: number;
  area?: number;
  collaborators: string[];
  styles?: string[];
  materials?: string[];
  usesRegionalMaterials: boolean;
  wasComputated: boolean;
  wasPrototyped: boolean;
  isRegenerative: boolean;
  isSustainable: boolean;
  isAuthoredByAntonio: boolean;
};
export type SiteData = {
  area?: number;
  location: string;
  country: string;
  city: string;
    latitude: number;
    longitude: number;
};
export type ProjectAssets = {
  cover?: {
    url: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  };
};
export type Project = {
  pcode: string;
  name: string;
  summary: string;
  description: string;
  tags: string[];

  intervention: InterventionData;
  site: SiteData;

  scale: ProjectScale;
  status: ProjectStatus;
  domain: ProjectDomain;

  keyStages?: {
    initiation: string;
    planning: string;
    execution: string;
    completion: string;
  };
  overview: Overview;
  assets?: ProjectAssets;
};
