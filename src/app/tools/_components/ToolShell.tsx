import Link from "next/link";
import RelatedStrip from "./RelatedStrip";

// Shared chrome for every /tools/* page. Underscore folder = not a route.
export default function ToolShell({
  breadcrumb,
  children,
  hideRelated = false,
}: {
  breadcrumb?: string;
  children: React.ReactNode;
  hideRelated?: boolean;
}) {
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-bold tracking-tight">
            ProBuildCalc
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try the app
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <nav className="mb-4 text-sm text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/tools" className="hover:underline">Tools</Link>
          {breadcrumb && (
            <>
              <span className="mx-2">/</span>
              <span>{breadcrumb}</span>
            </>
          )}
        </nav>
        {children}
        {!hideRelated && <RelatedStrip />}
      </div>

      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Link href="/" className="hover:underline">ProBuildCalc</Link> — LiDAR room
        scans &amp; material takeoffs for contractors.
      </footer>
    </main>
  );
}
