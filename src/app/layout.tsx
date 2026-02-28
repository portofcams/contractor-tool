import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { CapacitorProvider } from "@/components/capacitor-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ContractorCalc - Measurement & Material Calculator",
  description:
    "Calculate materials needed from floor plans in 30 seconds. Professional quotes for flooring, painting, and drywall contractors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <CapacitorProvider>{children}</CapacitorProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
