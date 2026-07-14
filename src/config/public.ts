type PublicSiteConfig = Readonly<{
  tallyFormId: string | null;
  bookingUrl: string | null;
  linkedInUrl: string | null;
  founderHeadshotUrl: string | null;
  cloudflareAnalyticsBeacon: string | null;
  canonicalSiteRoot: string;
  indexingEnabled: boolean;
}>;

const readText = (value: string | undefined): string | null => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

const readHttpsUrl = (value: string | undefined): string | null => {
  const normalized = readText(value);

  if (!normalized) {
    return null;
  }

  try {
    const url = new URL(normalized);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

const normalizeSiteRoot = (url: URL): string => {
  const normalized = new URL(url);
  normalized.hash = "";
  normalized.search = "";
  normalized.pathname = `${normalized.pathname.replace(/\/+$/, "")}/`;
  return normalized.toString();
};

const readSiteRoot = (value: string | undefined): string | null => {
  const normalized = readHttpsUrl(value);

  if (!normalized) {
    return null;
  }

  return normalizeSiteRoot(new URL(normalized));
};

const defaultCanonicalSiteRoot = normalizeSiteRoot(
  new URL(import.meta.env.BASE_URL, import.meta.env.SITE),
);
const configuredCanonicalOrigin = readSiteRoot(
  import.meta.env.PUBLIC_SITE_ORIGIN,
);

export const publicSiteConfig: PublicSiteConfig = Object.freeze({
  tallyFormId: readText(import.meta.env.PUBLIC_TALLY_FORM_ID),
  bookingUrl: readHttpsUrl(import.meta.env.PUBLIC_BOOKING_URL),
  linkedInUrl: readHttpsUrl(import.meta.env.PUBLIC_LINKEDIN_URL),
  founderHeadshotUrl: readHttpsUrl(
    import.meta.env.PUBLIC_FOUNDER_HEADSHOT_URL,
  ),
  cloudflareAnalyticsBeacon: readText(
    import.meta.env.PUBLIC_CLOUDFLARE_ANALYTICS_BEACON,
  ),
  canonicalSiteRoot:
    configuredCanonicalOrigin ?? defaultCanonicalSiteRoot,
  indexingEnabled:
    configuredCanonicalOrigin !== null &&
    import.meta.env.PUBLIC_SITE_INDEXING === "enabled",
});

export const canonicalUrlFor = (requestUrl: URL): string => {
  const basePath = import.meta.env.BASE_URL;
  const routePath = (requestUrl.pathname.startsWith(basePath)
    ? requestUrl.pathname.slice(basePath.length)
    : requestUrl.pathname
  ).replace(/^\/+/, "");

  return new URL(routePath, publicSiteConfig.canonicalSiteRoot).toString();
};
