import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import SidingCalculator from "./SidingCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/siding-calculator";
const TITLE = "Siding Calculator: Squares & Wall Area (Free)";
const DESCRIPTION = "Free siding calculator. Enter wall length and height to get the wall area and how many squares of siding you need, with doors and windows deducted.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["siding calculator", "how much siding do I need", "vinyl siding calculator", "siding squares calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much siding do I need?", a: "Multiply the total wall length (perimeter) by the wall height for gross area, subtract doors and windows, add ~10% waste, and divide by 100 for squares. Siding is sold by the square (100 sq ft)." },
  { q: "What is a square of siding?", a: "A square covers 100 square feet of wall. A box of vinyl siding typically covers two squares (200 sq ft), but check the carton." },
  { q: "How much waste should I add for siding?", a: "Plan on about 10% for a simple rectangular house and up to 15% for homes with many gables, corners, and openings that create more cut pieces." },
  { q: "Do I need to subtract windows and doors?", a: "Yes — deduct roughly 21 sq ft per door and 15 sq ft per window from the gross wall area, then apply waste to the net." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function SidingCalculatorPage() {
  return (
    <ToolShell breadcrumb="Siding Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Siding Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter wall length and height to get the wall area and squares of siding to order, with openings deducted.</p>
      <div className="mt-8"><SidingCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to estimate siding</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Find the gross wall area (<code>perimeter × height</code>), subtract doors and windows, add ~10% waste, and divide by 100 for squares. Trim, corners, and channel are estimated by linear foot.</p></section>
      <ToolCTA headline="Measure the whole exterior from a scan" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Siding calculator FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
