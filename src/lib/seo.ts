import "server-only";
import type { Metadata } from "next";
import { SITE_URL } from "./site";
import { getPageSeo } from "./queries";

/** Page metadata with optional admin overrides stored in page_seo. */
export function pageMeta(path: string, title: string, description: string, extra: Partial<Metadata> = {}): Metadata {
  const o = getPageSeo(path);
  const t = o?.title || title;
  const d = o?.description || description;
  const url = SITE_URL + (path === "/" ? "" : path);
  return {
    title: path === "/" ? { absolute: t } : t,
    description: d,
    alternates: { canonical: url },
    openGraph: { title: t, description: d, url, siteName: "GOODWIN SECURITY W.L.L.", type: "website", locale: "en_BH", images: [{ url: "/og.png", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: t, description: d },
    ...extra,
  };
}
