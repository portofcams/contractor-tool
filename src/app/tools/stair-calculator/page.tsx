import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import StairCalculator from "./StairCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/stair-calculator";
const TITLE = "Stair Calculator: Rise, Run & Number of Steps (Free)";
const DESCRIPTION = "Free stair calculator. Enter the total rise to get the number of steps, the exact riser height, tread count, and total run — checked against common code limits.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["stair calculator", "rise and run calculator", "how many stairs", "riser height calculator", "stair stringer calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many steps do I need?", a: "Divide the total floor-to-floor rise by a comfortable riser height of about 7 to 7.5 inches and round to the nearest whole number. A 108-inch rise divided by 7.5 is about 14 risers." },
  { q: "What is the maximum riser height?", a: "The widely adopted residential limit is a maximum riser of 7-3/4 inches and a minimum tread depth of 10 inches, with no more than 3/8 inch variation between steps. Always confirm your local code." },
  { q: "What's the difference between rise and run?", a: "Rise is the vertical height of each step (and the total rise is floor to floor); run is the horizontal tread depth. Total run is the tread depth times the number of treads, which is the number of steps minus one." },
  { q: "How do I find the riser height exactly?", a: "Once you fix the number of risers, divide the total rise by that number. Fourteen risers over a 108-inch rise gives 7.71 inches per riser — every riser should be equal." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function StairCalculatorPage() {
  return (
    <ToolShell breadcrumb="Stair Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Stair Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter the total rise to get the number of steps, exact riser height, tread count, and total run — flagged against common code limits.</p>
      <div className="mt-8"><StairCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to lay out stairs</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Divide the total rise by a target riser (~7.5&quot;) and round to whole risers, then divide the total rise by that count for the exact riser height. Treads equal risers minus one; total run is treads × tread depth. Keep risers ≤ 7-3/4&quot; and treads ≥ 10&quot;.</p></section>
      <ToolCTA headline="Capture floor-to-floor heights from a scan" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Stair calculator FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
