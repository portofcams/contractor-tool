import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import DrywallCalculator from "./DrywallCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/drywall-calculator";
const TITLE = "Drywall Calculator: How Many Sheets Do I Need? (Free)";
const DESCRIPTION =
  "Free drywall calculator. Enter room dimensions to get how many sheets of drywall you need, plus rough screw, joint compound, and tape estimates. Supports 4×8, 4×10, and 4×12 sheets.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: [
    "drywall calculator",
    "how many sheets of drywall",
    "sheetrock calculator",
    "drywall sheets calculator",
    "gypsum board calculator",
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
  { q: "How many sheets of drywall do I need?", a: "Add up the wall area — 2 × (length + width) × height — plus the ceiling if you're boarding it, add about 10% for waste, then divide by the sheet size (32 sq ft for a 4×8, 48 for a 4×12). Round up to whole sheets." },
  { q: "Should I use 4×8 or 4×12 drywall sheets?", a: "Bigger 4×12 sheets mean fewer seams to tape and finish, so pros prefer them for large walls and ceilings. 4×8 sheets are easier to carry and handle in tight spaces or for DIY." },
  { q: "How much joint compound and tape do I need?", a: "As a rough rule, plan on about 0.05 lb of joint compound and roughly 0.4 linear feet of tape per square foot of board. The calculator gives a quick estimate, but buy a little extra." },
  { q: "How many screws per sheet of drywall?", a: "Roughly 32 screws per 4×8 sheet on walls with 16-inch stud spacing. Ceilings and 12-inch spacing use more." },
];

const faqJsonLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function DrywallCalculatorPage() {
  return (
    <ToolShell breadcrumb="Drywall Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Drywall Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter room dimensions to get how many sheets of drywall to buy — plus
        rough screw, joint compound, and tape estimates.
      </p>

      <div className="mt-8"><DrywallCalculator /></div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate drywall</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Total the wall area with <code>2 × (length + width) × height</code>, add the
          ceiling (<code>length × width</code>) if you&apos;re boarding it, add ~10% for
          waste, and divide by the sheet area. Order full sheets — a few extra
          beat a second trip to the lumberyard.
        </p>
      </section>

      <ToolCTA headline="Take off a whole room from one LiDAR scan" />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Drywall calculator FAQ</h2>
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
