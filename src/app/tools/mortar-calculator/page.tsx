import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import MortarCalculator from "./MortarCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/mortar-calculator";
const TITLE = "Mortar Calculator: Bags of Mortar for Brick or Block (Free)";
const DESCRIPTION = "Free mortar calculator. Enter wall area and brick or block size to get the number of 60 lb mortar bags needed for a masonry project.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["mortar calculator", "how many bags of mortar", "mortar mix calculator", "brick mortar calculator", "block mortar calculator", "masonry mortar estimate"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many bags of mortar do I need per 100 bricks?", a: "A standard 60 lb bag of type-S or type-N mortar covers about 25 to 30 standard bricks laid with 3/8-inch joints. For 100 bricks you'll need roughly 3 to 4 bags. The exact amount depends on joint thickness and whether you're mixing to a stiff or wet consistency." },
  { q: "What is the difference between Type S and Type N mortar?", a: "Type N is the standard all-purpose mortar for above-grade exterior and interior walls — good for general brick, block, and stone. Type S is stronger and more moisture-resistant, used for at-grade or below-grade work like foundations, retaining walls, and pavers. Type M is the strongest and used below grade in contact with soil." },
  { q: "How thick should mortar joints be?", a: "Standard brick joints are 3/8 inch. Concrete block joints are also typically 3/8 inch. Thicker joints use more mortar and add to cost; thinner joints are harder to tool and can crack. Always follow the mason code for your region, especially in seismic or freeze-thaw areas." },
  { q: "How much area does one bag of mortar cover?", a: "A 60 lb bag of premixed mortar covers roughly 7 to 8 square feet of brick wall at standard joint thickness, or about 15 to 20 standard bricks. For concrete block (8×8×16 units), one bag covers about 10 to 12 blocks." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function MortarCalculatorPage() {
  return (
    <ToolShell breadcrumb="Mortar Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mortar Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter wall area or brick/block count to get the number of mortar bags needed for your masonry project.</p>
      <div className="mt-8"><MortarCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate mortar</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">A standard 60 lb bag of Type S mortar covers roughly 25–30 standard bricks (3/8-in joints) or 10–12 CMU blocks. For wall area: divide total square feet by 7.5 for brick, or 13 for block, to get bag count — then add 10% waste. Mix mortar to a stiff peanut-butter consistency so it holds its shape when pressed.</p>
      </section>
      <ToolCTA headline="Get wall area from a LiDAR scan in seconds" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Mortar calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
