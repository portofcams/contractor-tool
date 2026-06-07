import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import JoistCalculator from "./JoistCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/joist-calculator";
const TITLE = "Joist Calculator: How Many Joists? (Free)";
const DESCRIPTION = "Free floor and deck joist calculator. Enter frame length and joist spacing to get how many joists you need at 12, 16, or 24 inches on center.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["joist calculator", "floor joist calculator", "deck joist calculator", "how many joists do I need", "joist spacing calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many floor joists do I need?", a: "Divide the frame length in inches by the on-center spacing and add one for the end joist. A 16-ft frame at 16-inch spacing needs 13 joists. Add rim joists and blocking separately." },
  { q: "What spacing should floor joists be?", a: "Sixteen inches on center is the standard residential floor joist spacing for most subfloor and floor finishes. Twelve inches provides a stiffer floor; 24 inches is used in some engineered systems. Deck joists are typically 16 inches OC." },
  { q: "How do I size a floor joist?", a: "Joist size depends on span length, spacing, and load. A 2×8 at 16 OC can typically span about 12 feet; 2×10 spans about 15 feet; 2×12 about 18 feet. Always check the span tables in your local code or consult an engineer." },
  { q: "What is a rim joist?", a: "A rim joist (or band joist) runs along the perimeter of the frame, perpendicular to the regular joists. It caps the joist ends and ties the frame together. Add two rim joists — one on each end — each equal to the frame length." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function JoistCalculatorPage() {
  return (
    <ToolShell breadcrumb="Joist Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Floor &amp; Deck Joist Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter frame length and joist spacing to get how many joists you need at 12, 16, or 24 inches on center — for floors, decks, and platforms.</p>
      <div className="mt-8"><JoistCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate joists</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Joist count = (frame length in inches ÷ spacing) + 1 end joist. Add two rim joists (each the frame length) plus blocking rows at mid-span for longer runs. Joist <em>size</em> is governed by span tables — this calculator gives count only.</p>
      </section>
      <ToolCTA headline="Frame takeoffs from a LiDAR scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Joist calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
