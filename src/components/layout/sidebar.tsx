"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SyncBadge } from "@/components/sync-badge";
import { GlobalSearch } from "@/components/global-search";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/projects", label: "Projects", icon: "briefcase" },
  { href: "/quotes", label: "Quotes", icon: "file-text" },
  { href: "/quotes/new", label: "New Quote", icon: "plus-circle" },
  { href: "/estimates/new", label: "New Estimate", icon: "clipboard" },
  { href: "/scan", label: "Room Scanner", icon: "scan" },
  { href: "/jobs", label: "Jobs", icon: "calendar" },
  { href: "/time-tracking", label: "Time Tracking", icon: "clock" },
  { href: "/receipts", label: "Receipts", icon: "camera" },
  { href: "/invoices", label: "Invoices", icon: "receipt" },
  { href: "/team", label: "Team", icon: "hard-hat" },
  { href: "/subcontractors", label: "Subcontractors", icon: "truck" },
  { href: "/templates", label: "Templates", icon: "copy" },
  { href: "/price-book", label: "Price Book", icon: "book" },
  { href: "/customers", label: "Customers", icon: "users" },
  { href: "/settings/billing", label: "Billing", icon: "credit-card" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

const iconMap: Record<string, string> = {
  grid: "M3 3h7v7H3V3zm11 0h7v7h-7V3zm-11 11h7v7H3v-7zm11 0h7v7h-7v-7z",
  briefcase: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M8 12v4M16 12v4",
  "file-text":
    "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  "plus-circle": "M12 2a10 10 0 100 20 10 10 0 000-20zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  calendar: "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18",
  receipt: "M4 2v20l4-2 4 2 4-2 4 2V2l-4 2-4-2-4 2-4-2zM8 10h8M8 14h4",
  "hard-hat": "M2 18h20M4 18v-4a8 8 0 0116 0v4M12 2v6M4 14h16",
  truck: "M1 3h15v13H1V3zm15 8h4l3 3v2h-7v-5zM5.5 18a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm13 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  copy: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z",
  users:
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  "credit-card":
    "M1 4h22v16H1V4zm0 6h22M5 14h4",
  clipboard:
    "M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2 M9 2h6a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1z",
  scan:
    "M7 7h10v10H7V7zM4 4v4M4 16v4M20 4v4M20 16v4M4 4h4M16 4h4M4 20h4M16 20h4",
  book:
    "M4 19.5A2.5 2.5 0 016.5 17H20 M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z",
  clock:
    "M12 2a10 10 0 100 20 10 10 0 000-20zm0 6v4l3 3",
  camera:
    "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z",
  settings:
    "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Main navigation"
      className="hidden md:flex md:w-64 md:flex-col bg-sidebar backdrop-blur-xl border-r border-sidebar-border"
    >
      <div className="p-6 pb-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-foreground">
          ProBuildCalc
        </Link>
        <SyncBadge />
      </div>
      <div className="px-4 pb-4">
        <GlobalSearch />
      </div>
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : item.href === "/settings"
              ? pathname === "/settings"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
              )}
            >
              <svg
                className="h-[18px] w-[18px] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={iconMap[item.icon] || ""}
                />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground text-[13px]"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
