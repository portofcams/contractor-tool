import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import BrickCalculator from "./BrickCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/brick-calculator";
const TITLE = "Brick & Block Calculator: How Many Do I Need? (Free)";
const DESCRIPTION = "Free brick and block calculator. Enter wall length and height to get how many bricks or concrete blocks you need, plus a rough mortar estimate.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["brick calculator", "how many bricks do I need", "block calculator", "concrete block calculator", "cmu calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}` },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many bricks do I need per square foot?", a: "For standard modular brick with a 3/8-inch mortar joint, plan on about 7 bricks per square foot of wall face. Multiply your wall area by 7 and add ~10% for waste and breakage." },
  { q: "How many concrete blocks per square foot?", a: "Standard 8×8×16-inch CMU blocks cover about 1.125 blocks per square foot of wall, since each block face is roughly 0.89 sq ft including the joint." },
  { q: "How much mortar do I need?", a: "As a rough guide, one 80 lb bag of mortar lays about 125 modular bricks or about 33 standard blocks. Joint size and mix change this, so buy a little extra." },
  { q: "Do I subtract doors and windows?", a: "Yes — calculate the gross wall area (length × height), then subtract the area of any large openings before applying the per-square-foot figure." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function BrickCalculatorPage() {
  return (
    <ToolShell breadcrumb="Brick Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Brick &amp; Block Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter the wall length and height to get how many bricks or concrete blocks to order, plus a rough mortar estimate.</p>
      <div className="mt-8"><BrickCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to estimate brick and block</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Find the wall face area (length × height, minus openings), then multiply by units per square foot — about 7 for modular brick or 1.125 for standard block — and add ~10% for waste. Mortar is estimated per unit.</p></section>
      <ToolCTA headline="Take off masonry walls from a scan" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Brick calculator FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
