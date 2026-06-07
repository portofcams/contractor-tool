import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import PoolVolumeCalculator from "./PoolVolumeCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/pool-volume-calculator";
const TITLE = "Pool Volume Calculator: Gallons in a Swimming Pool (Free)";
const DESCRIPTION = "Free pool volume calculator. Enter pool shape, dimensions, and depth to get the volume in gallons and cubic feet — for rectangular, oval, and round pools.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["pool volume calculator", "how many gallons in a pool", "swimming pool calculator", "pool gallon calculator", "pool size calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do I calculate gallons in a swimming pool?", a: "For a rectangular pool: length × width × average depth (in feet) × 7.48 gallons per cubic foot. For oval pools, multiply by 0.785 instead of the full width. For round pools: π × radius² × depth × 7.48." },
  { q: "What is the average depth of a pool?", a: "Average depth is the shallow end depth plus the deep end depth divided by two. For a pool that is 3 feet in the shallow end and 6 feet in the deep end, the average depth is 4.5 feet." },
  { q: "Why does pool volume matter?", a: "All pool chemical dosing — chlorine, algaecide, pH adjusters, shock — is calculated per gallon or per 10,000 gallons. Getting the volume wrong leads to under- or over-treating the water." },
  { q: "How many gallons is a typical residential pool?", a: "A common 16×32 ft rectangular pool with 4.5 ft average depth holds about 17,200 gallons. Smaller 12×24 pools run around 10,800 gallons. Large pools can exceed 30,000 gallons." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function PoolVolumeCalculatorPage() {
  return (
    <ToolShell breadcrumb="Pool Volume Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Pool Volume Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter pool shape, dimensions, and average depth to get the volume in gallons and cubic feet — for rectangular, oval, and round swimming pools.</p>
      <div className="mt-8"><PoolVolumeCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate pool volume</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Rectangular: <code>length × width × avg depth × 7.48</code>. Oval: multiply by 0.785 before the depth. Round: use <code>π × radius²</code> for the area. Average depth = (shallow + deep) ÷ 2. Knowing your exact gallon count is essential for correct chemical dosing.</p>
      </section>
      <ToolCTA headline="Measure pool decks and coping from a scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Pool volume FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
