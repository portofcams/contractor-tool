import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import MulchCalculator from "./MulchCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/mulch-calculator";
const TITLE = "Mulch & Soil Calculator: Cubic Yards & Bags (Free)";
const DESCRIPTION =
  "Free mulch and topsoil calculator. Enter bed length, width, and depth to get cubic yards and how many bags of mulch, soil, compost, or gravel you need.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["mulch calculator", "how much mulch do I need", "topsoil calculator", "cubic yards calculator", "gravel calculator"],
  openGraph: {
    type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much mulch do I need?", a: "Multiply the bed's length × width × depth (in feet) to get cubic feet, then divide by 27 for cubic yards. A 10×10 ft bed at 3 inches deep needs about 25 cubic feet, or just under one cubic yard." },
  { q: "How many bags of mulch are in a cubic yard?", a: "Bagged mulch is usually 2 cubic feet per bag, and a cubic yard is 27 cubic feet — so it takes about 13–14 bags to equal one cubic yard." },
  { q: "How deep should mulch be?", a: "Apply 2–3 inches to refresh existing beds and 3–4 inches for a new bed or good weed suppression. Deeper than 4 inches can smother roots." },
  { q: "Does this work for topsoil and gravel?", a: "Yes — the volume math is the same for mulch, topsoil, compost, and gravel. Just pick the matching bag size, or order in bulk by the cubic yard." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function MulchCalculatorPage() {
  return (
    <ToolShell breadcrumb="Mulch Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mulch &amp; Soil Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter your bed dimensions and depth to get cubic yards — and how many
        bags — of mulch, topsoil, compost, or gravel.
      </p>
      <div className="mt-8"><MulchCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate mulch</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Volume in cubic feet is <code>length × width × (depth ÷ 12)</code>. Divide by
          27 for cubic yards (how bulk material is sold) or by the bag size (usually
          2 cu ft) for bag count. Round up.
        </p>
      </section>
      <ToolCTA headline="Scope hardscape and landscape jobs fast" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Mulch calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
