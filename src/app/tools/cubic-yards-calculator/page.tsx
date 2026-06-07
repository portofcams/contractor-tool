import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import CubicYardsCalculator from "./CubicYardsCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/cubic-yards-calculator";
const TITLE = "Cubic Yards Calculator (Free) — Concrete, Soil, Gravel";
const DESCRIPTION = "Free cubic yards calculator. Enter length, width, and depth to get the volume in cubic yards and cubic feet — for concrete, soil, mulch, gravel, or sand.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["cubic yards calculator", "how to calculate cubic yards", "yardage calculator", "cubic yard calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do I calculate cubic yards?", a: "Multiply length × width × depth, all in feet, then divide by 27 (since a cubic yard is 27 cubic feet). If your depth is in inches, divide it by 12 first to convert to feet." },
  { q: "How many cubic feet are in a cubic yard?", a: "There are 27 cubic feet in one cubic yard (3 ft × 3 ft × 3 ft)." },
  { q: "How do I convert inches of depth to cubic yards?", a: "Divide the depth in inches by 12 to get feet, multiply by the length and width in feet, then divide by 27. This calculator does the conversion when you pick inches." },
  { q: "What materials are sold by the cubic yard?", a: "Concrete, topsoil, mulch, compost, gravel, sand, and fill dirt are all commonly ordered by the cubic yard. Add 5–10% for waste and compaction." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function CubicYardsCalculatorPage() {
  return (
    <ToolShell breadcrumb="Cubic Yards Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Cubic Yards Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter length, width, and depth to get the volume in cubic yards and cubic feet — for concrete, soil, mulch, gravel, or sand.</p>
      <div className="mt-8"><CubicYardsCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to calculate cubic yards</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Convert all measurements to feet, multiply length × width × depth for cubic feet, and divide by 27 for cubic yards. It&apos;s the universal volume formula for bulk materials.</p></section>
      <ToolCTA headline="Measure dig and fill areas from a scan" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Cubic yards FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
