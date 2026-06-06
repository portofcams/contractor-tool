import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";

// Public, indexable routes only. Auth pages (/login, /signup) are intentionally
// excluded — they're noindex (see (auth)/layout.tsx). The root "/" 307-redirects
// to /landing, so /landing is the canonical homepage entry here.
// Add /tools/* and other content pages to this list as they ship.
const ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}> = [
  { path: "/landing", priority: 1.0, changeFrequency: "weekly" },
  { path: "/support", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
