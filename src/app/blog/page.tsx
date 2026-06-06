import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "./posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";

export const metadata: Metadata = {
  title: "Estimating & Takeoff Guides for Contractors | ProBuildCalc",
  description:
    "How-to guides and cost breakdowns for contractors and DIYers — estimating flooring, paint, drywall, concrete, roofing, and more from the ProBuildCalc team.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website", siteName: "ProBuildCalc",
    title: "Estimating & Takeoff Guides for Contractors | ProBuildCalc",
    description: "How-to guides and cost breakdowns for contractors and DIYers.",
    url: `${SITE_URL}/blog`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }],
  },
};

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-bold tracking-tight">ProBuildCalc</Link>
          <Link href="/signup" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">Try the app</Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Estimating &amp; Takeoff Guides</h1>
        <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
          Practical how-to guides and cost breakdowns for contractors and serious
          DIYers — how to measure, estimate, and price the work.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="block rounded-xl border border-neutral-200 p-5 transition hover:border-blue-400 hover:shadow-sm dark:border-neutral-800 dark:hover:border-blue-700">
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">{p.title}</h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{p.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Link href="/tools" className="hover:underline">Free calculators</Link> · <Link href="/" className="hover:underline">ProBuildCalc</Link>
      </footer>
    </main>
  );
}
