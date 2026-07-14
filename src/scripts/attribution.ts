const allowedAttributionParameters = Object.freeze([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "referral",
]);
const allowedOffers = new Set([
  "enterprise-assessment",
  "workflow-review",
  "agentic-workspace",
]);

export const copyAllowedAttribution = (
  source: URLSearchParams,
  destination: URLSearchParams,
): void => {
  for (const parameter of allowedAttributionParameters) {
    const value = source.get(parameter)?.trim();

    if (value) {
      destination.set(parameter, value);
    }
  }
};

export const copyAllowedOffer = (
  source: URLSearchParams,
  destination: URLSearchParams,
): void => {
  const destinationOffer = destination.get("offer")?.trim();

  if (destinationOffer && allowedOffers.has(destinationOffer)) {
    destination.set("offer", destinationOffer);
    return;
  }

  destination.delete("offer");
  const offer = source.get("offer")?.trim();

  if (offer && allowedOffers.has(offer)) {
    destination.set("offer", offer);
  }
};

export const preserveAttributionOnLinks = (): void => {
  const pageParameters = new URLSearchParams(window.location.search);

  document
    .querySelectorAll<HTMLAnchorElement>("a[data-preserve-attribution]")
    .forEach((link) => {
      const destination = new URL(link.href, window.location.href);
      const originalSearch = destination.search;
      copyAllowedOffer(pageParameters, destination.searchParams);
      copyAllowedAttribution(pageParameters, destination.searchParams);

      if (destination.search !== originalSearch) {
        link.href = destination.toString();
      }
    });
};
