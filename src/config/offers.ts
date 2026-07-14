export const offerSlugs = Object.freeze({
  enterpriseAssessment: "enterprise-assessment",
  workflowReview: "workflow-review",
  agenticWorkspace: "agentic-workspace",
} as const);

export type OfferSlug = (typeof offerSlugs)[keyof typeof offerSlugs];

const approvedOfferSlugs = Object.freeze(Object.values(offerSlugs)) as readonly OfferSlug[];

export const isApprovedOffer = (value: string): value is OfferSlug =>
  approvedOfferSlugs.includes(value as OfferSlug);
