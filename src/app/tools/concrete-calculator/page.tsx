import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import ConcreteCalculator from "./ConcreteCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/concrete-calculator";
const TITLE = "Concrete Calculator: Cubic Yards & Bags (Free)";
const DESCRIPTION =
  "Free concrete calculator for slabs. Enter length, width, and thickness to get cubic yards of ready-mix and the number of 60 lb or 80 lb bags you'd need.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: [
    "concrete calculator",
    "cubic yards calculator",
    "concrete slab calculator",
    "how many bags of concrete",
    "concrete yardage calculator",
  ],
  openGraph: {
    type: "website", siteName: "ProBuildCalc",
    title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do I calculate cubic yards of concrete?", a: "Multiply length × width × thickness in feet (convert the thickness from inches by dividing by 12) to get cubic feet, then divide by 27 to get cubic yards. A 10×10 ft slab at 4 inches is about 1.23 cubic yards." },
  { q: "How many bags of concrete are in a cubic yard?", a: "A cubic yard is 27 cubic feet. An 80 lb bag yields about 0.6 ft³, so it takes roughly 45 bags to make a cubic yard; 60 lb bags yield about 0.45 ft³, or roughly 60 bags per yard." },
  { q: "Should I order ready-mix or use bags?", a: "For anything over about 1 cubic yard, ordering ready-mix delivered by the truck is cheaper and faster than mixing bags. Bags make sense for small pours, footings, and setting posts." },
  { q: "How thick should a concrete slab be?", a: "Four inches is standard for patios, sheds, and walkways. Driveways and anything carrying vehicle loads are usually 5–6 inches with rebar or wire mesh." },
];

const faqJsonLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function ConcreteCalculatorPage() {
  return (
    <ToolShell breadcrumb="Concrete Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Concrete Slab Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter your slab&apos;s length, width, and thickness to get the cubic yards
        of ready-mix to order — or how many 60 lb / 80 lb bags for a small pour.
      </p>

      <div className="mt-8"><ConcreteCalculator /></div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate concrete for a slab</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Volume in cubic feet is <code>length × width × (thickness ÷ 12)</code>. Divide
          by 27 for cubic yards — how ready-mix is sold. Always add 5–10% for
          spillage, uneven subgrade, and over-excavation so you don&apos;t come up
          short mid-pour.
        </p>
      </section>

      <ToolCTA headline="Scope the whole job, not just the slab" />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Concrete calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt>
              <dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </ToolShell>
  );
}
