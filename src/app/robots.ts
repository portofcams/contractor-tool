import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // App surface that should never be indexed. Auth pages are NOT disallowed
        // here on purpose — they carry a meta noindex instead, which only works if
        // crawlers are allowed to fetch them.
        disallow: ["/api/", "/portal/", "/quote/", "/review/", "/pay/", "/admin", "/account"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
