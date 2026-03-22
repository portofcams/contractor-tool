/**
 * POST /api/import/website
 *
 * Scrapes a website URL and extracts business profile data:
 * company name, phone, email, address, logo, description, services, social links.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ScrapedProfile {
  companyName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo: string | null;
  description: string | null;
  services: string[];
  socialLinks: string[];
  hours: string | null;
}

function extractMeta(html: string, property: string): string | null {
  // Match both property="..." and name="..." meta tags
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1].trim();
  }
  return null;
}

function extractJsonLd(html: string): Record<string, unknown> | null {
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      // Could be an array or single object
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const t = item["@type"];
        if (
          t === "LocalBusiness" ||
          t === "Organization" ||
          t === "HomeAndConstructionBusiness" ||
          t === "GeneralContractor" ||
          t === "Plumber" ||
          t === "Electrician" ||
          t === "RoofingContractor" ||
          (typeof t === "string" && t.includes("Business"))
        ) {
          return item;
        }
      }
      // If no business type found, return first object with a name
      for (const item of items) {
        if (item.name) return item;
      }
    } catch {
      // Invalid JSON-LD, skip
    }
  }
  return null;
}

function extractPhones(html: string): string[] {
  // Match common US phone formats, also href="tel:..."
  const telHrefs = [...html.matchAll(/href=["']tel:([^"']+)["']/gi)].map((m) => m[1].trim());
  const patterns = html.match(
    /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
  );
  const all = [...telHrefs, ...(patterns || [])];
  // Deduplicate by digits only
  const seen = new Set<string>();
  return all.filter((p) => {
    const digits = p.replace(/\D/g, "");
    if (digits.length < 10 || seen.has(digits)) return false;
    seen.add(digits);
    return true;
  });
}

function extractEmails(html: string): string[] {
  // From mailto: links and from text
  const mailtos = [...html.matchAll(/href=["']mailto:([^"'?]+)/gi)].map((m) => m[1].trim());
  const textEmails = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const all = [...mailtos, ...textEmails];
  const seen = new Set<string>();
  return all.filter((e) => {
    const lower = e.toLowerCase();
    // Filter out common non-business emails
    if (lower.includes("wixpress") || lower.includes("sentry") || lower.includes("example.com")) return false;
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
}

function extractAddresses(html: string): string[] {
  // Look for common address patterns in visible text (strip tags first)
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const addresses: string[] = [];
  // US address: number + street, city, state zip
  const re = /\d{1,5}\s[\w\s.]+,\s*[\w\s]+,\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    addresses.push(m[0].trim());
  }
  return [...new Set(addresses)];
}

function extractSocialLinks(html: string): string[] {
  const socialDomains = [
    "facebook.com",
    "instagram.com",
    "twitter.com",
    "x.com",
    "linkedin.com",
    "youtube.com",
    "yelp.com",
    "tiktok.com",
    "nextdoor.com",
  ];
  const links = [...html.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi)].map((m) => m[1]);
  const social = links.filter((l) => socialDomains.some((d) => l.includes(d)));
  return [...new Set(social)];
}

function extractServices(html: string): string[] {
  // Look for common service list patterns
  const services: string[] = [];
  // Try to find a "services" section
  const servicesSection = html.match(
    /(?:services|what we do|our services|specialties)[^<]*<\/[^>]+>([\s\S]{0,3000}?)(?:<\/(?:section|div|ul)>)/i
  );
  if (servicesSection) {
    const listItems = servicesSection[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (listItems) {
      for (const li of listItems.slice(0, 20)) {
        const text = li.replace(/<[^>]+>/g, "").trim();
        if (text.length > 2 && text.length < 100) {
          services.push(text);
        }
      }
    }
  }
  return services;
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}

function resolveUrl(base: string, path: string): string {
  if (path.startsWith("http")) return path;
  try {
    return new URL(path, base).href;
  } catch {
    return path;
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  // Normalize URL
  let fetchUrl = url.trim();
  if (!/^https?:\/\//i.test(fetchUrl)) {
    fetchUrl = "https://" + fetchUrl;
  }

  let html: string;
  try {
    const res = await fetch(fetchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ProBuildCalc/1.0; +https://probuildcalc.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch website: ${res.status} ${res.statusText}` },
        { status: 422 }
      );
    }
    html = await res.text();
  } catch (err) {
    return NextResponse.json(
      { error: `Could not reach website: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 422 }
    );
  }

  // Extract structured data first (highest quality)
  const jsonLd = extractJsonLd(html);

  // Extract meta tags
  const ogTitle = extractMeta(html, "og:title");
  const ogDesc = extractMeta(html, "og:description");
  const ogImage = extractMeta(html, "og:image");
  const metaDesc = extractMeta(html, "description");
  const pageTitle = extractTitle(html);

  // Extract contact info
  const phones = extractPhones(html);
  const emails = extractEmails(html);
  const addresses = extractAddresses(html);
  const socialLinks = extractSocialLinks(html);
  const services = extractServices(html);

  // Build profile, preferring structured data
  const profile: ScrapedProfile = {
    companyName:
      (jsonLd?.name as string) ||
      ogTitle ||
      pageTitle ||
      null,
    phone:
      (jsonLd?.telephone as string) ||
      phones[0] ||
      null,
    email:
      (jsonLd?.email as string) ||
      emails[0] ||
      null,
    address:
      (() => {
        if (jsonLd?.address) {
          const a = jsonLd.address as Record<string, string>;
          if (typeof a === "string") return a;
          return [a.streetAddress, a.addressLocality, a.addressRegion, a.postalCode]
            .filter(Boolean)
            .join(", ");
        }
        return addresses[0] || null;
      })(),
    logo:
      (() => {
        const logoVal = (jsonLd?.logo as string | Record<string, string>) || ogImage;
        if (!logoVal) return null;
        const logoUrl = typeof logoVal === "string" ? logoVal : logoVal.url;
        return logoUrl ? resolveUrl(fetchUrl, logoUrl) : null;
      })(),
    description:
      (jsonLd?.description as string) ||
      ogDesc ||
      metaDesc ||
      null,
    services:
      services.length > 0
        ? services
        : jsonLd?.hasOfferCatalog
          ? []
          : [],
    socialLinks,
    hours:
      (() => {
        if (jsonLd?.openingHours) {
          const h = jsonLd.openingHours;
          return Array.isArray(h) ? h.join(", ") : String(h);
        }
        return null;
      })(),
  };

  return NextResponse.json(profile);
}
