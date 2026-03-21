import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/stripe";

const heroFeatures = [
  "Snap a photo, get a quote",
  "LiDAR room scanning",
  "Voice-to-quote dictation",
];

const features = [
  {
    title: "AI Photo-to-Quote",
    description:
      "Take a photo of any room. Our AI identifies the space, calculates materials, and generates a professional quote — ready to send before you leave the driveway.",
    icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
    badge: "AI-Powered",
  },
  {
    title: "LiDAR Room Scanning",
    description:
      "Use your iPhone's LiDAR sensor to scan any room in seconds. Get exact measurements — walls, floors, ceiling — no tape measure needed.",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    badge: "iPhone LiDAR",
  },
  {
    title: "Voice-to-Quote",
    description:
      "Walk through a job site and dictate what you see. \"12x14 living room, hardwood floors, two coats of paint.\" We turn it into a detailed quote.",
    icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
    badge: "Hands-Free",
  },
  {
    title: "3D Room Walkthroughs",
    description:
      "Show customers exactly what the finished job will look like. Preview materials, colors, and layouts in an interactive 3D view before work begins.",
    icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
    badge: "AR Preview",
  },
  {
    title: "Receipt Scanner",
    description:
      "Snap a photo of any receipt. We extract the line items, match them to your price book, and track costs against the job budget automatically.",
    icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
    badge: null,
  },
  {
    title: "Instant Professional Quotes",
    description:
      "Generate branded PDF quotes with line items, material costs, labor, and markup. Email or share a link — customers accept and e-sign online.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    badge: null,
  },
  {
    title: "Smart Price Book",
    description:
      "Track material prices, set your labor rates, define waste factors per material. Quotes auto-update when prices change. Never underbid again.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    badge: null,
  },
  {
    title: "Job Site Dashboard",
    description:
      "Win rates, revenue tracking, quote pipeline, customer history. Know exactly where every job stands from your phone.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    badge: null,
  },
  {
    title: "Works Offline",
    description:
      "Full functionality without cell service. Create quotes in basements, rural sites, anywhere. Syncs automatically when you're back online.",
    icon: "M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3",
    badge: null,
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Scan or Snap",
    description: "Point your phone at the room. Use LiDAR for exact measurements, or snap a photo and let AI do the math.",
  },
  {
    step: "2",
    title: "Pick Materials",
    description: "Choose from your price book or add custom items. Waste factors, labor rates, and markup calculated automatically.",
  },
  {
    step: "3",
    title: "Send & Close",
    description: "Generate a branded PDF, email it or text a link. Customer reviews, e-signs, and you've won the job — all from your truck.",
  },
];

const planOrder = ["free", "pro", "business"] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Nav */}
      <nav className="border-b border-[#1e293b]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[#f1f5f9]">
            Contractor<span className="text-primary">Calc</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-400 hover:text-gray-200">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Start Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Gradient blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5">
            AI-powered quoting for contractors
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-[#f1f5f9] leading-[1.1] tracking-tight">
            Quote any job
            <br />
            in 60 seconds
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Snap a photo. Scan a room. Dictate what you see.
            ContractorCalc turns it into a professional quote with exact materials, labor, and pricing — before you leave the job site.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-base px-10 py-6 text-lg">
                Start Free — No Credit Card
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {heroFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-[#020617]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#f1f5f9] mb-4">
            Three steps. One minute. Done.
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-xl mx-auto">
            No more spreadsheets, no more guessing, no more going back to the office to write up quotes.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl font-bold text-primary">{s.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#f1f5f9] mb-4">
            Tools that actually help on the job site
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-xl mx-auto">
            Built by someone who watched contractors struggle with bad software. Every feature exists because a real contractor needed it.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-[#1e293b] bg-[#0f172a] hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                      </svg>
                    </div>
                    {f.badge && (
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                        {f.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-[#f1f5f9] mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Numbers */}
      <section className="py-16 px-4 bg-[#020617]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "60s", label: "Average quote time" },
              { value: "3", label: "Trade types supported" },
              { value: "0.1\"", label: "LiDAR accuracy" },
              { value: "100%", label: "Offline capable" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4" id="pricing">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#f1f5f9] mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Start free. Upgrade when it&apos;s making you money.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {planOrder.map((planId) => {
              const plan = PLANS[planId];
              const isPro = planId === "pro";
              return (
                <Card
                  key={planId}
                  className={isPro ? "border-primary border-2 relative bg-[#1e293b] scale-[1.02]" : "border-[#1e293b] bg-[#0f172a]"}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-[#0f172a] font-bold">Best Value</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg text-[#f1f5f9]">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-[#f1f5f9]">
                        ${plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-400">/mo</span>
                      )}
                    </div>
                    {plan.price > 0 && (
                      <p className="text-xs text-gray-500 mt-1">14-day free trial</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                          <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup" className="block">
                      <Button className="w-full" variant={isPro ? "default" : "outline"}>
                        {plan.price === 0 ? "Get Started Free" : "Start 14-Day Trial"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold text-[#f1f5f9] mb-4">
            Your next quote takes 60 seconds.
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            Every minute you spend writing quotes by hand is a minute you&apos;re not on the job site making money.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-base px-10 py-6 text-lg">
              Start Free — No Credit Card
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Flooring, painting, and drywall. More trades coming soon.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#1e293b]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ContractorCalc
          </span>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-300">Terms</Link>
            <Link href="/login" className="hover:text-gray-300">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
