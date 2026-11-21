/** Public site identity used for SEO (canonical URLs, Open Graph, JSON-LD, sitemap). */
export const SITE_NAME = "Apex Select Automotive";

/** Absolute origin of the public site, e.g. https://www.apexselect.co.uk (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

export const SITE_LOCALE = "en_GB";
export const CURRENCY = "GBP";
