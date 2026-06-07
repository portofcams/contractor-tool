import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import WoodFenceCostCalculator from "./WoodFenceCostCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/wood-fence-cost-calculator";
const TITLE = "Wood Fence Cost Calculator: Materials & Estimate (Free)";
const DESCRIPTION = "Free wood fence cost calculator. Enter fence length and height to get post count, picket count, rail count, and total material cost estimate.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["wood fence cost calculator", "fence material calculator", "how much does a wood fence cost", "fence post calculator", "privacy fence cost estimate"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much does a wood fence cost per linear foot?", a: "A basic pressure-treated pine privacy fence typically costs $15 to $30 per linear foot in materials. Cedar or redwood runs $25 to $45 per foot. Installed cost (materials + labor) usually doubles the material cost, putting most wood fences at $25 to $60 per linear foot installed." },
  { q: "How many fence posts do I need?", a: "Posts go every 6 to 8 feet on center. For an 8-foot spacing: divide fence length by 8 and add 1 for the end post. A 100-foot fence needs about 14 posts at 8-foot spacing. Corner and gate posts should be set closer (no more than 4 feet from the corner) and use heavier stock." },
  { q: "How deep should fence posts be set?", a: "Set posts at least one-third of the total post length below grade, plus 6 inches for gravel drainage. For a 6-foot fence, use 9-foot posts set 3 feet deep. In freeze-thaw climates, posts must go below the frost line to prevent heaving — typically 36 to 48 inches in northern states." },
  { q: "How many pickets do I need for a privacy fence?", a: "Standard pickets are 3.5 inches wide with a 1/4-inch gap between them, giving a spacing of 3.75 inches center-to-center. Divide fence length in inches by 3.75 and round up. A 100-foot fence needs about 320 pickets. Board-on-board (overlapping) style uses roughly 20% more pickets." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function WoodFenceCostCalculatorPage() {
  return (
    <ToolShell breadcrumb="Wood Fence Cost Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Wood Fence Cost Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter fence run length and height to get post count, rail and picket quantities, and a total material cost estimate.</p>
      <div className="mt-8"><WoodFenceCostCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate a wood fence</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Posts at 8-ft spacing: <code>(length ÷ 8) + 1</code>. Rails: 2 per bay (top + bottom) for a 4-ft fence, 3 per bay for 6+ ft. Pickets: <code>length × 12 ÷ 3.75</code> (3.5-in picket + 1/4-in gap). Add 10% waste on all materials. Post holes need concrete — one 50 lb bag per hole for standard 4×4 posts in firm soil.</p>
      </section>
      <ToolCTA headline="Measure the fence line from a LiDAR scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Wood fence cost calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
