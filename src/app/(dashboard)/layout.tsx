import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { PullToRefresh } from "@/components/pull-to-refresh";
import { OfflineBanner } from "@/components/offline-banner";
import { OnboardingWrapper } from "@/components/onboarding-wrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <OfflineBanner />
      <OnboardingWrapper />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-4 pt-4 md:px-10 md:py-8 mobile-main-padding">
          <PullToRefresh>{children}</PullToRefresh>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
