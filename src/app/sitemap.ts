import type { MetadataRoute } from "next";
import { getProjects, searchProducts } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/about", "/products", "/services", "/brands", "/projects", "/contact", "/quote", "/privacy", "/terms"].map((p) => ({
    url: SITE_URL + p, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7,
  }));
  // Sample (placeholder) entries are excluded from search engines.
  const products = searchProducts({}).filter((p) => !p.is_sample).map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 }));
  const projects = getProjects().filter((p) => !p.is_sample).map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.5 }));
  return [...pages, ...products, ...projects];
}
