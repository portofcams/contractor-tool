import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { CapacitorProvider } from "@/components/capacitor-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0071e3" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js" async />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light")return;if(t==="system"&&!window.matchMedia("(prefers-color-scheme: dark)").matches)return;document.documentElement.classList.add("dark")}catch(e){}})()`
              + `;if("serviceWorker"in navigator)navigator.serviceWorker.register("/sw.js")`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Providers>
            <CapacitorProvider>{children}</CapacitorProvider>
          </Providers>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
