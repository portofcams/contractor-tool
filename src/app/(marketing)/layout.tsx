import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const TITLE = "ProBuildCalc — LiDAR Room Scans & Contractor Material Takeoffs";
const DESCRIPTION =
  "Scan a room with LiDAR and turn it into material takeoffs, square footage, blueprints, and quotes in seconds. The job-site measuring app built for contractors, remodelers, and builders.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/landing" },
  openGraph: {
    type: "website",
    siteName: "ProBuildCalc",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/landing`,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

// SoftwareApplication structured data → eligible for rich results. No
// aggregateRating until there are real reviews (faking it risks a penalty).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ProBuildCalc",
  applicationCategory: "BusinessApplication",
  operatingSystem: "iOS, Web",
  url: SITE_URL,
  description: DESCRIPTION,
  offers: { "@type": "Offer", price: "9.99", priceCurrency: "USD" },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
