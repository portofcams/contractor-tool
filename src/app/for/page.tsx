import type { Metadata } from "next";
import Link from "next/link";
import { ROLES } from "./roles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";

export const metadata: Metadata = {
  title: "ProBuildCalc by Trade — Flooring, Paint, Concrete & More",
  description: "See how ProBuildCalc's LiDAR scanning and material takeoffs work for your trade — flooring, painting, remodeling, decks, and concrete.",
  alternates: { canonical: "/for" },
  openGraph: { type: "website", siteName: "ProBuildCalc", title: "ProBuildCalc by Trade", description: "LiDAR scanning and material takeoffs for your trade.", url: `${SITE_URL}/for`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
};

export default function ForIndex() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-bold tracking-tight">ProBuildCalc</Link>
          <Link href="/signup" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">Get started free</Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for your trade</h1>
        <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">See exactly how ProBuildCalc&apos;s LiDAR scanning and material takeoffs fit the way you work.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {ROLES.map((r) => (
            <Link key={r.slug} href={`/for/${r.slug}`} className="block rounded-xl border border-neutral-200 p-5 transition hover:border-blue-400 hover:shadow-sm dark:border-neutral-800 dark:hover:border-blue-700">
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">{r.trade}</h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{r.dek}</p>
            </Link>
          ))}
        </div>
      </div>
      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Link href="/tools" className="hover:underline">Calculators</Link> · <Link href="/blog" className="hover:underline">Guides</Link> · <Link href="/" className="hover:underline">ProBuildCalc</Link>
      </footer>
    </main>
  );
}
