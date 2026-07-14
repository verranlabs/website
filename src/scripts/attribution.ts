const allowedAttributionParameters = Object.freeze([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "referral",
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

export const preserveAttributionOnLinks = (): void => {
  const pageParameters = new URLSearchParams(window.location.search);

  document
    .querySelectorAll<HTMLAnchorElement>("a[data-preserve-attribution]")
    .forEach((link) => {
      const destination = new URL(link.href, window.location.href);
      const originalSearch = destination.search;
      copyAllowedAttribution(pageParameters, destination.searchParams);

      if (destination.search !== originalSearch) {
        link.href = destination.toString();
      }
    });
};
