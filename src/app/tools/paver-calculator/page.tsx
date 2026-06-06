import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import PaverCalculator from "./PaverCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/paver-calculator";
const TITLE = "Paver Calculator: How Many Pavers? (Free)";
const DESCRIPTION = "Free paver calculator. Enter your patio size and paver dimensions to get how many pavers you need, plus gravel base and bedding sand for the project.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["paver calculator", "how many pavers do I need", "patio paver calculator", "paver base calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}` },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many pavers do I need?", a: "Divide the patio area (plus ~5% waste) by the square footage of one paver. A 4×8-inch paver is 0.22 sq ft, so a 200 sq ft patio needs roughly 955 of them with waste." },
  { q: "How much gravel base do pavers need?", a: "Use a compacted gravel base of about 4 inches for patios and walkways, and 6 to 12 inches for driveways. Above the gravel, lay about 1 inch of bedding sand." },
  { q: "How much waste should I add for pavers?", a: "About 5% for a straight or running-bond pattern, and 10% for herringbone, circular, or diagonal layouts that require many cut pieces around the edges." },
  { q: "What sand goes between pavers?", a: "Use polymeric sand to fill the joints after laying — it hardens to lock the pavers together and resist weeds and washout. It's separate from the bedding sand underneath." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function PaverCalculatorPage() {
  return (
    <ToolShell breadcrumb="Paver Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Paver Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter your patio size and paver dimensions to get how many pavers to buy, plus the gravel base and bedding sand.</p>
      <div className="mt-8"><PaverCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to estimate a paver patio</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Find the area, divide by the square footage of one paver (<code>paver W × L ÷ 144</code>), and add 5–10% for cuts. Below the pavers, plan ~4&quot; of compacted gravel base and ~1&quot; of bedding sand, then polymeric sand in the joints.</p></section>
      <ToolCTA headline="Lay out patios and hardscape from a scan" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Paver calculator FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
