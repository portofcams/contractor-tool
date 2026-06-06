import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in · ProBuildCalc",
  description: "Sign in or create your ProBuildCalc account.",
  // Auth pages add no SEO value — keep them crawlable (so the noindex is seen)
  // but out of the index.
  robots: { index: false, follow: true },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
