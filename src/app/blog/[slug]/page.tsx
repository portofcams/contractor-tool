import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "../posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: `${post.title} | ProBuildCalc`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      siteName: "ProBuildCalc",
      title: `${post.title} | ProBuildCalc`,
      description: post.description,
      url: `${SITE_URL}${path}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }],
    },
    twitter: { card: "summary", title: `${post.title} | ProBuildCalc`, description: post.description },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Organization", name: "ProBuildCalc" },
        publisher: { "@type": "Organization", name: "ProBuildCalc" },
        mainEntityOfPage: `${SITE_URL}${path}`,
      },
      ...(post.faq.length
        ? [{
            "@type": "FAQPage",
            mainEntity: post.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }]
        : []),
    ],
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-bold tracking-tight">ProBuildCalc</Link>
          <Link href="/signup" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">Try the app</Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10">
        <nav className="mb-4 text-sm text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:underline">Blog</Link>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">{post.dek}</p>

        <div className="mt-8 space-y-8">
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-2xl font-semibold">{s.heading}</h2>
              {s.body.map((para, i) => (
                <p key={i} className="mt-3 text-neutral-700 dark:text-neutral-300">{para}</p>
              ))}
            </section>
          ))}
        </div>

        {post.related.length > 0 && (
          <section className="mt-10 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
            <h2 className="text-lg font-semibold">Related free calculators</h2>
            <ul className="mt-2 space-y-1">
              {post.related.map((r) => (
                <li key={r.href}><Link href={r.href} className="text-blue-600 hover:underline dark:text-blue-400">{r.label}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/40">
          <h2 className="text-xl font-bold">Stop estimating by hand</h2>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">
            ProBuildCalc scans a room with your iPhone&apos;s LiDAR and builds the
            square footage, material takeoff, and a blueprint automatically.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Get started free</Link>
            <Link href="/tools" className="rounded-md border border-neutral-300 px-4 py-2 font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900">Free calculators</Link>
          </div>
        </section>

        {post.faq.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
              {post.faq.map((f) => (
                <div key={f.q} className="py-4">
                  <dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt>
                  <dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </article>

      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Link href="/" className="hover:underline">ProBuildCalc</Link> — LiDAR room scans &amp; material takeoffs for contractors.
      </footer>
    </main>
  );
}
