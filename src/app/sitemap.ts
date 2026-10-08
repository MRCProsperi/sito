import type { MetadataRoute } from "next";
import { getAllMatches, getAllNews, getAllPages } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// The site is exported with trailingSlash: true, so every URL here ends with "/"
// (same form as the canonical tags and as the URLs the server actually serves).
const url = (p: string) => `${SITE_URL}${p}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/news", "/giovanili", "/calendario", "/iscrizioni/modulo-basket", "/iscrizioni/modulo-minibasket", "/batlh-studio"];

  const pages = getAllPages();

  // /calendario/<squadra> exists only for teams that have matches (same rule as the page itself)
  const matches = getAllMatches();
  const calendarSlugs = pages
    .map((p) => p.slug)
    .filter((slug): slug is string => Boolean(slug))
    .filter((slug) =>
      matches.some((e) => e.teamId === slug || (e.teamId && (slug.includes(e.teamId) || e.teamId.includes(slug)))),
    );

  const all = [
    ...staticRoutes.map((p) => ({ url: url(p) })),
    ...pages.map((p) => ({ url: url(`/${p.slug}`) })),
    ...calendarSlugs.map((s) => ({ url: url(`/calendario/${s}`) })),
    ...getAllNews().map((n) => ({
      url: url(`/news/${n.slug}`),
      lastModified: n.meta.date ? new Date(n.meta.date) : undefined,
    })),
  ];

  // no duplicates (e.g. a page that is also listed as a static route)
  return all.filter((item, i) => all.findIndex((x) => x.url === item.url) === i);
}
