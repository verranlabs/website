export const campaignAttributionParameters = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "referral",
] as const;

export const tallyAttributionParameters = [
  "offer",
  ...campaignAttributionParameters,
] as const;

export const copyAttributionParameters = (
  source: URLSearchParams,
  destination: URL,
  parameters: readonly string[],
): boolean => {
  let copiedParameter = false;

  for (const parameter of parameters) {
    const value = source.get(parameter);

    if (value !== null) {
      destination.searchParams.set(parameter, value);
      copiedParameter = true;
    }
  }

  return copiedParameter;
};
