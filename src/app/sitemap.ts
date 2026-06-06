import type { MetadataRoute } from "next";
import { POSTS } from "./blog/posts";

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
  { path: "/tools", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/square-footage-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/flooring-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/paint-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/drywall-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/concrete-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/tile-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/roofing-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/deck-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/baseboard-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/fence-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/mulch-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/carpet-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/insulation-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/gravel-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/stud-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/plywood-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/sod-calculator", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/support", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...ROUTES.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...POSTS.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
