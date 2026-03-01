import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { PullToRefresh } from "@/components/pull-to-refresh";
import { OfflineBanner } from "@/components/offline-banner";

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
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          <PullToRefresh>{children}</PullToRefresh>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
