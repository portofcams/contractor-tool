import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/stripe";

const features = [
  {
    title: "Material Calculator",
    description:
      "Enter room dimensions, pick your material — get exact quantities with waste factors built in.",
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  {
    title: "Professional Quotes",
    description:
      "Generate branded PDF quotes in seconds. Email them directly or share a link for customers to accept online.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    title: "Customer Portal",
    description:
      "Customers review, sign, and accept quotes online. No back-and-forth calls — close jobs faster.",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    title: "3 Trade Types",
    description:
      "Purpose-built calculators for flooring, painting, and drywall — with material-specific waste factors.",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    title: "Track Everything",
    description:
      "Dashboard with win rates, revenue, and quote status. Know exactly where your business stands.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    title: "Works on iPhone",
    description:
      "Take it to the job site. Create quotes on your phone, email them before you leave the driveway.",
    icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
];

const planOrder = ["free", "pro", "business"] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1a1d23]">
      {/* Nav */}
      <nav className="border-b border-[#333842]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-amber-500">ContractorCalc</span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-400 hover:text-gray-200">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Built for contractors
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#e8e6e3] leading-tight">
            Calculate materials.
            <br />
            Send quotes.
            <br />
            <span className="text-amber-500">Close jobs faster.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto">
            Enter room dimensions, pick your materials, and generate a
            professional quote in 30 seconds. Flooring, painting, and drywall.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8">
                Start Free — No Credit Card
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            5 free quotes per month. Upgrade anytime.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-[#15171c]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#e8e6e3] mb-12">
            Everything you need to quote faster
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-[#333842] bg-[#22262e]">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 bg-amber-500/15 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-5 h-5 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={f.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[#e8e6e3] mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4" id="pricing">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#e8e6e3] mb-4">
            Simple pricing
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Start free. Upgrade when you&apos;re ready.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {planOrder.map((planId) => {
              const plan = PLANS[planId];
              const isPro = planId === "pro";
              return (
                <Card
                  key={planId}
                  className={isPro ? "border-amber-500 border-2 relative bg-[#22262e]" : "border-[#333842] bg-[#22262e]"}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-amber-500 text-[#1a1d23]">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg text-[#e8e6e3]">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-[#e8e6e3]">
                        ${plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-400">/mo</span>
                      )}
                    </div>
                    {plan.price > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        14-day free trial
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <svg
                            className="w-4 h-4 text-green-400 mt-0.5 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup" className="block">
                      <Button
                        className="w-full"
                        variant={isPro ? "default" : "outline"}
                      >
                        {plan.price === 0 ? "Get Started" : "Start Free Trial"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-amber-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stop guessing. Start quoting.
          </h2>
          <p className="text-amber-100 mb-8">
            Join contractors who save hours every week with accurate material
            calculations and professional quotes.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-[#1a1d23] text-amber-500 hover:bg-[#22262e] text-base px-8"
            >
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#333842]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ContractorCalc
          </span>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/login" className="hover:text-gray-300">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-gray-300">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
