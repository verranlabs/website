import { offerSlugs } from "./offers";

export const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export const publicAssetUrl = (path: string): string =>
  `${basePath}/${path.replace(/^\/+/, "")}`;

export const routes = Object.freeze({
  home: `${basePath}/`,
  agenticWorkspace: `${basePath}/private-agentic-workspace/`,
  assessmentContact: `${basePath}/contact/?offer=${offerSlugs.enterpriseAssessment}`,
  workflowReviewContact: `${basePath}/contact/?offer=${offerSlugs.workflowReview}`,
  agenticWorkspaceContact: `${basePath}/contact/?offer=${offerSlugs.agenticWorkspace}`,
  contact: `${basePath}/contact/`,
  qualifiedContact: `${basePath}/contact/qualified/`,
  receivedContact: `${basePath}/contact/received/`,
  privacy: `${basePath}/privacy/`,
});
