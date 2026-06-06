import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROLES, getRole } from "../roles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";

export function generateStaticParams() {
  return ROLES.map((r) => ({ role: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role } = await params;
  const r = getRole(role);
  if (!r) return {};
  const path = `/for/${r.slug}`;
  return {
    title: `${r.title} | ProBuildCalc`,
    description: r.description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "ProBuildCalc", title: `${r.title} | ProBuildCalc`, description: r.description, url: `${SITE_URL}${path}` },
    twitter: { card: "summary_large_image", title: `${r.title} | ProBuildCalc`, description: r.description },
  };
}

export default async function RolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const r = getRole(role);
  if (!r) notFound();

  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-bold tracking-tight">ProBuildCalc</Link>
          <Link href="/signup" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">Get started free</Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <nav className="mb-4 text-sm text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/for" className="hover:underline">For</Link>
          <span className="mx-2">/</span>
          <span>{r.trade}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">ProBuildCalc for {r.trade}</h1>
        <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">{r.dek}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/signup" className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Get started free</Link>
          <Link href="/landing" className="rounded-md border border-neutral-300 px-4 py-2 font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900">See how it works</Link>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Why {r.trade.toLowerCase()} use ProBuildCalc</h2>
          <ul className="mt-4 space-y-3">
            {r.benefits.map((b) => (
              <li key={b} className="flex gap-3 text-neutral-700 dark:text-neutral-300">
                <span className="mt-1 text-blue-600 dark:text-blue-400">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Free calculators for your trade</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {r.tools.map((t) => (
              <Link key={t.href} href={t.href} className="block rounded-xl border border-neutral-200 p-4 transition hover:border-blue-400 dark:border-neutral-800 dark:hover:border-blue-700">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{t.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {r.guides.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold">Guides</h2>
            <ul className="mt-3 space-y-1">
              {r.guides.map((g) => (
                <li key={g.href}><Link href={g.href} className="text-blue-600 hover:underline dark:text-blue-400">{g.label}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/40">
          <h2 className="text-xl font-bold">Quote your next job in minutes</h2>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">Scan the space with your iPhone&apos;s LiDAR and ProBuildCalc builds the square footage, takeoff, and a blueprint automatically.</p>
          <div className="mt-4"><Link href="/signup" className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Get started free</Link></div>
        </section>
      </div>

      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Link href="/tools" className="hover:underline">Calculators</Link> · <Link href="/blog" className="hover:underline">Guides</Link> · <Link href="/" className="hover:underline">ProBuildCalc</Link>
      </footer>
    </main>
  );
}
