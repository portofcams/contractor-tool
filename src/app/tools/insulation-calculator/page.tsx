import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import InsulationCalculator from "./InsulationCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/insulation-calculator";
const TITLE = "Insulation Calculator: Bags & Batts (Free)";
const DESCRIPTION =
  "Free insulation calculator. Enter the area and the coverage per bag or roll to get how many bags or batts of insulation you need for walls, attics, or floors.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["insulation calculator", "how much insulation do I need", "attic insulation calculator", "blown in insulation calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much insulation do I need?", a: "Measure the area you're insulating in square feet, then divide by the coverage printed on the bag or bundle for your target R-value. Add about 5% for waste and trimming." },
  { q: "How many square feet does a bag of blown-in insulation cover?", a: "It depends on the R-value — a single bag might cover 40–60 sq ft at R-30 but far less at R-49. Always use the coverage chart on the bag, then enter that number here." },
  { q: "How do I calculate insulation batts?", a: "Divide the wall or attic area by the square feet per bundle of batts. Batts are sized to fit 16- and 24-inch stud and joist spacing." },
  { q: "What R-value do I need?", a: "It depends on climate and where you're insulating — attics commonly target R-38 to R-60, walls R-13 to R-21. Check local code, then match the coverage on the product." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function InsulationCalculatorPage() {
  return (
    <ToolShell breadcrumb="Insulation Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Insulation Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter the area and the coverage per bag or roll to get how many bags or
        batts of insulation you need for walls, attics, or floors.
      </p>
      <div className="mt-8"><InsulationCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate insulation</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Find the area to insulate, then divide by the coverage on the product
          for your target R-value. Blown-in coverage drops as R-value rises, so
          always read the bag&apos;s chart and enter that number.
        </p>
      </section>
      <ToolCTA headline="Capture attic and wall areas from a scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Insulation calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
