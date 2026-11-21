import type { MetadataRoute } from "next";
import { getSitemapVehicles } from "@/lib/api/vehicles-server";
import { absoluteUrl } from "@/lib/seo/vehicle-seo";

/** /sitemap.xml — public pages plus every vehicle's SEO URL (refreshed hourly). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/vehicles"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/finance"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/part-exchange"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.5 },
  ];

  const vehicles = await getSitemapVehicles();
  const vehiclePages: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: absoluteUrl(`/vehicles/${v.slug}`),
    lastModified: v.updatedAt,
    changeFrequency: v.vehicleStatus === "sold" ? "monthly" : "weekly",
    // Sold cars stay listed (people still search for them) but rank below live stock.
    priority: v.vehicleStatus === "sold" ? 0.3 : 0.8,
    images: v.image ? [absoluteUrl(v.image)] : undefined,
  }));

  return [...staticPages, ...vehiclePages];
}
