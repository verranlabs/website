export const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export const publicAssetUrl = (path: string): string =>
  `${basePath}/${path.replace(/^\/+/, "")}`;

export const routes = Object.freeze({
  home: `${basePath}/`,
  assessmentContact: `${basePath}/contact/?offer=enterprise-assessment`,
  workflowReviewContact: `${basePath}/contact/?offer=workflow-review`,
  contact: `${basePath}/contact/`,
  qualifiedContact: `${basePath}/contact/qualified/`,
  receivedContact: `${basePath}/contact/received/`,
  privacy: `${basePath}/privacy/`,
});
