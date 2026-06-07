import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import RoughOpeningCalculator from "./RoughOpeningCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/rough-opening-calculator";
const TITLE = "Rough Opening Calculator for Doors & Windows (Free)";
const DESCRIPTION = "Free rough opening calculator. Enter the nominal door or window size to get the correct rough opening width and height, plus a header size guide.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["rough opening calculator", "door rough opening", "window rough opening", "rough opening size for door", "header size calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "What is a rough opening?", a: "A rough opening is the framed hole in a wall — wider and taller than the actual door or window unit — that provides space for the frame, shimming, and installation. The door or window unit sits inside and is shimmed plumb and level." },
  { q: "How big is a rough opening for a door?", a: "A standard rough opening for a pre-hung door is the nominal door width plus 2 inches wide (for a jack stud on each side) and the door height plus 2.5 inches (for the sill plate, door frame, and shimming). A 36×80-inch door needs a 38×82.5-inch rough opening." },
  { q: "How big is a rough opening for a window?", a: "Windows typically use a rough opening that is 1 inch wider and 1/2 inch taller than the window unit. Always check the window manufacturer's installation specs — some require different clearances." },
  { q: "What size header do I need?", a: "Header size depends on the span, load above, lumber species, and local code. As a rough guide: spans up to 36 inches often use doubled 2×4 or 2×6; wider spans step up from there. The calculator gives a starting point, but confirm with span tables or an engineer for load-bearing walls." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function RoughOpeningCalculatorPage() {
  return (
    <ToolShell breadcrumb="Rough Opening Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Rough Opening Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter the nominal door or window size to get the correct rough opening dimensions and a header size guide.</p>
      <div className="mt-8"><RoughOpeningCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to find a rough opening size</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">For a pre-hung door: add 2 inches to the width and 2.5 inches to the height. For a window: add 1 inch to the width and 1/2 inch to the height. Always verify against the manufacturer&apos;s installation guide — actual clearances vary by product.</p>
      </section>
      <ToolCTA headline="Capture wall openings from a LiDAR scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Rough opening FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
