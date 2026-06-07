import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import CaulkCalculator from "./CaulkCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/caulk-calculator";
const TITLE = "Caulk Calculator: How Many Tubes? (Free)";
const DESCRIPTION = "Free caulk calculator. Enter joint length, width, and depth to get how many 10 oz tubes of caulk you need for windows, doors, siding, or trim.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["caulk calculator", "how much caulk do I need", "caulking calculator", "how many tubes of caulk", "caulk coverage calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many linear feet does a tube of caulk cover?", a: "A standard 10 oz tube covers about 30–50 linear feet at a 1/4-inch wide by 1/4-inch deep bead. Wider or deeper joints use proportionally more — a 1/2-inch joint at 1/2-inch deep uses roughly 8 times as much caulk." },
  { q: "How do I calculate caulk needed?", a: "Multiply joint width by joint depth (in inches) to get the cross-section, then multiply by the joint length in feet and divide by the tube volume (~17 cubic inches for a 10 oz tube). The calculator above does this automatically." },
  { q: "Should I use a backer rod?", a: "Yes, for any gap deeper than 1/2 inch. Backer rod fills the gap before caulking so you use less caulk, and it prevents three-point adhesion — which causes caulk to tear as materials expand and contract." },
  { q: "What type of caulk should I use?", a: "Silicone for exterior joints, wet areas, and glass. Paintable latex (acrylic) for interior trim and drywall gaps. Polyurethane for wide exterior gaps and concrete. Always check that the product is rated for your application." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function CaulkCalculatorPage() {
  return (
    <ToolShell breadcrumb="Caulk Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Caulk Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter the total joint length, width, and depth to get how many 10 oz tubes of caulk you need.</p>
      <div className="mt-8"><CaulkCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate caulk</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Caulk volume is <code>joint width × joint depth × length</code>. A 10 oz tube holds about 17 cubic inches. Wider or deeper joints use dramatically more — doubling both dimensions quadruples the caulk needed. Use backer rod for deep gaps.</p>
      </section>
      <ToolCTA headline="Measure perimeters and joint runs from a scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Caulk calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
