import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import PexPipeCalculator from "./PexPipeCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/pex-pipe-calculator";
const TITLE = "PEX Pipe Calculator: Footage for Radiant Floor or Plumbing (Free)";
const DESCRIPTION = "Free PEX pipe calculator. Enter room area and loop spacing to get total footage of PEX tubing for radiant floor heating or plumbing supply runs.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["PEX pipe calculator", "radiant floor heating calculator", "how much PEX pipe do I need", "PEX tubing calculator", "hydronic floor heating calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do I calculate how much PEX I need for radiant heat?", a: "Divide the room area by the loop spacing (in feet) to get linear footage, then add 20% for connections, manifold runs, and waste. For a 12-inch spacing in a 200 sq ft room: 200 ÷ 1 ft = 200 ft of loop, plus 40 ft extra = 240 ft total." },
  { q: "What is the standard loop spacing for radiant floor heating?", a: "Six to twelve inches is the most common range. Use 6-inch spacing for high-heat-loss areas like garages or slab-on-grade in cold climates. Use 9- to 12-inch spacing for well-insulated slabs or heated subfloors. Wider spacing needs more BTUs from the boiler to compensate." },
  { q: "What size PEX is used for radiant heat?", a: "Half-inch PEX (1/2-in) is standard for radiant floor loops up to about 300 feet. Three-quarter-inch PEX is used for longer runs or higher-volume commercial loops. Domestic plumbing supply lines typically use 3/4-in for mains and 1/2-in for branch lines." },
  { q: "How long can a single PEX radiant loop be?", a: "Keep individual loops under 300 feet for 1/2-in PEX to maintain adequate flow and even heat distribution. Longer loops create excessive pressure drop, leading to cold spots near the end. For large rooms, split the area into multiple loops fed from a manifold." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function PexPipeCalculatorPage() {
  return (
    <ToolShell breadcrumb="PEX Pipe Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">PEX Pipe Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter room area and loop spacing to get total PEX footage for radiant floor heating, with loop count and a waste allowance.</p>
      <div className="mt-8"><PexPipeCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate PEX for radiant floors</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Formula: <code>area ÷ spacing (ft) + 20% waste</code>. At 9-inch spacing (0.75 ft) in a 300 sq ft room: 300 ÷ 0.75 = 400 ft of loop. Add 80 ft for manifold runs and connections = 480 ft total. Keep each loop under 300 ft — split larger rooms across multiple loops on a manifold.</p>
      </section>
      <ToolCTA headline="Scan the floor plan, get exact loop footage" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">PEX pipe calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
