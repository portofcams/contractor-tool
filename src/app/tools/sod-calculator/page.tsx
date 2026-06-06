import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import SodCalculator from "./SodCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/sod-calculator";
const TITLE = "Sod Calculator: Square Feet, Yards & Pallets (Free)";
const DESCRIPTION =
  "Free sod calculator. Enter your lawn dimensions to get the square footage, square yards, and number of pallets of sod you need, including waste.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["sod calculator", "how much sod do I need", "sod pallet calculator", "sod square yards"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much sod do I need?", a: "Multiply length × width for square feet and add 5–10% for waste and cuts around beds and curves. Divide by 9 for square yards if your sod is priced that way." },
  { q: "How many square feet are on a pallet of sod?", a: "Most pallets cover about 400–500 square feet (450 is a common average), but it varies by farm and slab size — confirm with your supplier before ordering." },
  { q: "How much waste should I add for sod?", a: "Add about 5% for a simple rectangular lawn and 10% for yards with curves, beds, or lots of cuts where pieces can't be reused." },
  { q: "How soon should I lay sod after delivery?", a: "Lay sod the same day it arrives — within 24 hours — and water it right away. Stacked sod heats up and dies quickly, especially in summer." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function SodCalculatorPage() {
  return (
    <ToolShell breadcrumb="Sod Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Sod Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter your lawn dimensions to get the square footage, square yards, and
        pallets of sod to order — with waste for cuts and curves.
      </p>
      <div className="mt-8"><SodCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to measure for sod</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Measure the lawn in rectangles, total the square footage, and add 5–10%
          for waste. Pallets cover roughly 450 sq ft each — round up, and have the
          ground prepped so you can lay it the day it arrives.
        </p>
      </section>
      <ToolCTA headline="Measure lawns and lots without a wheel" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Sod calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
