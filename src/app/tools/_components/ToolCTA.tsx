import Link from "next/link";

export default function ToolCTA({ headline = "Stop measuring by hand" }: { headline?: string }) {
  return (
    <section className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/40">
      <h2 className="text-xl font-bold">{headline}</h2>
      <p className="mt-2 text-neutral-700 dark:text-neutral-300">
        ProBuildCalc turns your iPhone&apos;s LiDAR scanner into a job-site
        measuring kit — walk the space and it captures the square footage,
        material takeoff, and a blueprint automatically. No tape measure, no
        graph paper.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Get started free
        </Link>
        <Link
          href="/landing"
          className="rounded-md border border-neutral-300 px-4 py-2 font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          See how it works
        </Link>
      </div>
    </section>
  );
}
