import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import FenceCalculator from "./FenceCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/fence-calculator";
const TITLE = "Fence Calculator: Posts, Rails & Pickets (Free)";
const DESCRIPTION =
  "Free fence calculator. Enter your fence length and post spacing to get the number of posts, sections, rails, and pickets you need.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["fence calculator", "how many fence posts", "fence picket calculator", "fence materials calculator"],
  openGraph: {
    type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many fence posts do I need?", a: "Divide the fence length by the post spacing (usually 8 ft) to get the number of sections, then add one — a 96-ft fence at 8-ft spacing needs 12 sections and 13 posts." },
  { q: "How far apart should fence posts be?", a: "Six to eight feet on center is standard. Eight feet is most common for wood fences; tighter spacing adds strength on slopes or in high wind." },
  { q: "How many rails per fence section?", a: "Use 2 rails for fences under about 5 feet and 3 rails for 6-foot privacy fences to keep boards from warping." },
  { q: "How many pickets do I need?", a: "Divide the fence length in inches by the picket width plus the gap. A solid privacy fence uses a 0-inch gap; a spaced picket look uses a positive gap." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function FenceCalculatorPage() {
  return (
    <ToolShell breadcrumb="Fence Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Fence Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter your fence length and post spacing to get posts, sections, rails,
        and pickets for a wood or picket fence.
      </p>
      <div className="mt-8"><FenceCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate fence materials</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Sections are <code>length ÷ spacing</code> (rounded up), posts are sections
          plus one, and rails are sections × rails-per-section. Pickets are the
          fence length in inches divided by the picket width plus gap. Add a post
          and concrete for each gate.
        </p>
      </section>
      <ToolCTA headline="Quote fencing and exterior work on-site" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Fence calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
