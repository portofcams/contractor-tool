"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe";
import { ContactForm } from "@/components/contact-form";

// ── Animated counter hook ──
function useCounter(target: number, duration = 1500, suffix = "") {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const startTime = performance.now();
        function tick(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
  return { ref, value: `${value}${suffix}` };
}

// ── Fade-up on scroll ──
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-5 h-px bg-blue-500" />
      <span className="text-xs font-semibold tracking-[0.14em] uppercase text-blue-600">{children}</span>
    </div>
  );
}

const TESTIMONIALS = [
  {
    quote: "Before ProBuildCalc I measured by hand and quoted from memory. Now I scan, review the numbers, and email a PDF — all before I leave the driveway.",
    name: "Mike R.", trade: "Flooring Contractor", location: "Tampa, FL", initial: "M",
  },
  {
    quote: "The tape calibration is the feature nobody talks about but everyone needs. Measure one wall, everything auto-corrects. My quotes went from guesses to numbers I can stand behind.",
    name: "Carlos V.", trade: "Painting Contractor", location: "Phoenix, AZ", initial: "C",
  },
  {
    quote: "I bid three concrete jobs in one afternoon. LiDAR gets me cubic yards and rebar counts in seconds. Went from a legal pad to a professional estimate.",
    name: "Jason T.", trade: "Concrete Contractor", location: "Nashville, TN", initial: "J",
  },
];

const TRADE_CARDS = [
  { trade: "Flooring Contractors", href: "/for/flooring-contractors", desc: "Scan a room, take off boxes with waste factor, quote on-site.", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { trade: "Painters", href: "/for/painters", desc: "Wall area, gallon counts by coat and coverage — deduct doors and windows.", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { trade: "Concrete Contractors", href: "/for/concrete-contractors", desc: "Cubic yards, rebar grid, base material — quote the pour with confidence.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { trade: "Roofing Contractors", href: "/for/roofers", desc: "Squares, bundle count by pitch, gutter footage — from a quick scan.", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
];

const FREE_TOOLS = [
  ["Square Footage", "/tools/square-footage-calculator"],
  ["Flooring", "/tools/flooring-calculator"],
  ["Paint", "/tools/paint-calculator"],
  ["Drywall", "/tools/drywall-calculator"],
  ["Concrete", "/tools/concrete-calculator"],
  ["Tile & Grout", "/tools/grout-calculator"],
  ["Roofing", "/tools/roofing-calculator"],
  ["Framing Cost", "/tools/framing-cost-calculator"],
  ["Driveway Cost", "/tools/driveway-cost-calculator"],
  ["Bathroom Tile", "/tools/bathroom-tile-calculator"],
  ["Shed Builder", "/tools/shed-calculator"],
  ["Wood Fence", "/tools/wood-fence-cost-calculator"],
];

const GRID_FEATURES = [
  { title: "Confidence Scoring", desc: "Every measurement rated high/medium/low with ±inches. Know what to trust before you quote.", tag: "Exclusive", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Tape Calibration", desc: "Measure one wall. All other measurements auto-correct — 60% more accurate than scan-only.", tag: null, icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { title: "Voice-to-Quote", desc: "Walk and dictate. \"12×14 living room, hardwood, two coats.\" We build the quote on the spot.", tag: null, icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
  { title: "8 View Modes", desc: "Floor plan, walls, 3D blueprint, render, point-to-point, PDF export, AR overlay, material preview.", tag: null, icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
  { title: "Inspection Reports", desc: "One tap → professional PDF with measurements, estimates, confidence ratings. Sends straight to the client.", tag: "New", icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" },
  { title: "AR Material Preview", desc: "Show clients what hardwood, tile, or paint looks like in their actual room. Point the phone, see the finish.", tag: null, icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { title: "Time Tracking", desc: "Clock in/out per job and crew member. Daily and weekly hour totals, auto-linked to the project.", tag: "New", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Receipt Scanner", desc: "Snap a receipt. AI extracts store, items, and totals — auto-linked to jobs as actual costs.", tag: "New", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" },
  { title: "Works Offline", desc: "Full functionality without cell service. Scan in basements, rural sites, anywhere. Syncs when back online.", tag: null, icon: "M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" },
  { title: "Multi-scan Averaging", desc: "Scan 2–3 times. We average the results and flag disagreements so you catch bad data before quoting.", tag: null, icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
];

const planOrder = ["free", "pro", "business"] as const;

export default function LandingPage() {
  const stat1 = useCounter(60, 1200, "s");
  const stat2 = useCounter(8, 800, "");
  const stat3 = useCounter(46, 1500, "");

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden">

      {/* ══════ NAV ══════ */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-3.5 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
            ProBuild<span className="text-blue-600">Calc</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/tools" className="hidden sm:block text-sm text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Calculators</Link>
            <Link href="/blog" className="hidden sm:block text-sm text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Guides</Link>
            <Link href="/for" className="hidden md:block text-sm text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors">By Trade</Link>
            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors ml-1">Sign In</Link>
            <Link href="/signup">
              <Button size="sm" className="ml-1 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Try Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════ HERO — 2-col split ══════ */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 px-5 md:px-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Left: text */}
            <div>
              <FadeUp>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-xs font-semibold text-blue-700">LiDAR Scanner + AI Estimates — iPhone & iPad</span>
                </div>
              </FadeUp>

              <FadeUp delay={0.08}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-slate-900">
                  Quote any room
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    in 60 seconds.
                  </span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.16}>
                <p className="mt-5 text-lg text-slate-500 leading-relaxed">
                  Scan with LiDAR. Snap a photo. Dictate what you see.
                  Professional quotes with exact measurements — from the job site.
                </p>
              </FadeUp>

              <FadeUp delay={0.24}>
                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <Link href="/signup">
                    <Button size="lg" className="px-8 h-12 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full sm:w-auto shadow-md shadow-blue-200">
                      Start Free — No Credit Card
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg" className="px-8 h-12 text-sm rounded-xl border-slate-300 text-slate-600 hover:bg-slate-50 w-full sm:w-auto">
                      See Features
                    </Button>
                  </Link>
                </div>
              </FadeUp>

              <FadeUp delay={0.32}>
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2">
                  {["iPhone LiDAR scanning", "AI photo estimates", "Confidence scoring", "Works offline", "46 free web calculators", "14-day free trial"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-500">
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* Right: iPhone mockup — scan results screen */}
            <FadeUp delay={0.18} className="flex justify-center md:justify-end">
              <div className="relative group">
                <div className="w-[260px] h-[530px] rounded-[36px] bg-[#1c1c1e] border-[3px] border-[#3a3a3c] p-3 shadow-2xl shadow-slate-300/60 group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-[#1c1c1e] rounded-b-2xl z-10" />
                  <div className="w-full h-full rounded-[28px] bg-black overflow-hidden relative">
                    <div className="flex justify-between px-5 pt-3 pb-1 text-[9px] text-white/60 font-medium">
                      <span>9:41</span>
                      <div className="w-3.5 h-2 border border-white/40 rounded-sm relative"><div className="absolute inset-[1px] right-[2px] bg-green-400 rounded-[1px]" /></div>
                    </div>
                    <div className="px-4 pt-1">
                      <p className="text-white text-xl font-bold">1,248 sqft</p>
                      <p className="text-white/40 text-[9px] mb-3">3 rooms · 4 walls · 2 doors</p>
                      <div className="flex gap-1 mb-3">
                        {["Floor", "Walls", "3D", "Render", "PDF"].map((m, i) => (
                          <div key={m} className={`px-2 py-1 rounded-full text-[7px] font-medium whitespace-nowrap ${i === 0 ? "bg-blue-600 text-white" : "bg-white/5 text-white/40"}`}>{m}</div>
                        ))}
                      </div>
                      {[
                        { name: "Living Room", sqft: 520, dims: "20’ × 26’", conf: "high", acc: "±0.5\"" },
                        { name: "Kitchen", sqft: 380, dims: "16’ × 24’", conf: "high", acc: "±0.8\"" },
                        { name: "Bedroom", sqft: 348, dims: "14.5’ × 24’", conf: "medium", acc: "±1.5\"" },
                      ].map((room, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white text-[10px] font-medium">{room.name}</p>
                              <p className="text-white/30 text-[8px]">{room.dims} · {room.sqft} sqft</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`px-1.5 py-0.5 rounded text-[6px] font-bold uppercase ${room.conf === "high" ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}`}>{room.conf}</span>
                              <span className="text-white/40 text-[8px]">{room.acc}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="p-2.5 rounded-lg bg-green-500/[0.06] border border-green-500/20 flex items-center gap-2 mb-3">
                        <div className="relative w-8 h-8 shrink-0">
                          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                            <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                            <circle cx="16" cy="16" r="13" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="81.68" strokeDashoffset="14.7" strokeLinecap="round" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-white">82</span>
                        </div>
                        <div>
                          <p className="text-green-400 text-[8px] font-semibold">High Confidence</p>
                          <p className="text-white/30 text-[7px]">Ready to use · 92% coverage</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 py-2.5 bg-blue-600 rounded-xl text-center"><span className="text-white text-[9px] font-semibold">Build Quote</span></div>
                        <div className="flex-1 py-2.5 bg-white/10 rounded-xl text-center"><span className="text-white/60 text-[9px] font-semibold">Export PDF</span></div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 px-2 pb-4 pt-1.5">
                      <div className="flex justify-around">
                        {["Home", "Scanner", "Quote", "Quotes", "Clients"].map((tab, i) => (
                          <div key={tab} className={`flex flex-col items-center gap-0.5 ${i === 1 ? "text-blue-400" : "text-white/30"}`}>
                            <div className="w-1 h-1 rounded-full bg-current" />
                            <span className="text-[7px] font-medium">{tab}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[10px] text-slate-400 font-semibold mt-3 uppercase tracking-wider">Scan Results Screen</p>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="py-10 px-6 md:px-12 border-y border-slate-200 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div ref={stat1.ref}>
            <p className="text-3xl md:text-4xl font-bold text-blue-600">{stat1.value}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wider uppercase">Avg quote time</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-blue-600">±0.5&quot;</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wider uppercase">LiDAR accuracy</p>
          </div>
          <div ref={stat2.ref}>
            <p className="text-3xl md:text-4xl font-bold text-blue-600">{stat2.value}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wider uppercase">Scan view modes</p>
          </div>
          <div ref={stat3.ref}>
            <p className="text-3xl md:text-4xl font-bold text-blue-600">{stat3.value}</p>
            <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wider uppercase">Free calculators</p>
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="py-16 px-6 md:px-12 bg-slate-50">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp>
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-slate-900">
              Scan. Review. <span className="text-blue-600">Send.</span>
            </h2>
            <p className="text-slate-500 mb-10 max-w-lg">No spreadsheets. No driving back to the office. Quote on-site, close on-site.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Scan the Room", desc: "Point your iPhone at the room. LiDAR maps every wall, door, and window in seconds. Real-time coaching guides you to a complete scan." },
              { step: "02", title: "Review & Calibrate", desc: "See measurements with confidence scores. Tape one wall to calibrate everything — 60% more accurate. 8 view modes including 3D blueprint and AR overlay." },
              { step: "03", title: "Quote & Send", desc: "Pick materials from your price book. Generate a branded PDF. Email it or share a link — customer reviews and e-signs on their phone." },
            ].map((s, i) => (
              <FadeUp key={s.step} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full">
                  <span className="text-5xl font-bold text-blue-100 font-mono">{s.step}</span>
                  <h3 className="text-lg font-bold mt-2 mb-2 text-slate-900">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FREE TOOLS + TRADE CARDS ══════ */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp>
            <SectionLabel>Free tools</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-slate-900">
              46 free calculators. <span className="text-slate-400">No sign-up.</span>
            </h2>
            <p className="text-slate-500 mb-8 max-w-lg">
              Concrete, tile, grout, PEX pipe, framing cost, driveway cost, shed materials — estimate any job in seconds, right in your browser.
            </p>
          </FadeUp>

          {/* Trade cards */}
          <FadeUp delay={0.08}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {TRADE_CARDS.map((tc) => (
                <Link key={tc.href} href={tc.href} className="group block rounded-2xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-md transition-all bg-slate-50 hover:bg-blue-50">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mb-3 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={tc.icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{tc.trade}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{tc.desc}</p>
                  <p className="text-xs font-semibold text-blue-600 mt-2 group-hover:underline">See tools →</p>
                </Link>
              ))}
            </div>
          </FadeUp>

          {/* Quick-pick calculator chips */}
          <FadeUp delay={0.14}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-5">
              {FREE_TOOLS.map(([name, href]) => (
                <Link key={href} href={href} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-all font-medium text-center">
                  {name}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/tools" className="text-blue-600 hover:underline font-medium">All 46 calculators →</Link>
              <Link href="/blog" className="text-blue-600 hover:underline font-medium">Estimating guides →</Link>
              <Link href="/for" className="text-blue-600 hover:underline font-medium">All trades →</Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════ BENTO FEATURES ══════ */}
      <section className="py-16 px-6 md:px-12 bg-slate-50" id="features">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp>
            <SectionLabel>Capabilities</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-slate-900">
              Everything on the job site.
            </h2>
            <p className="text-slate-500 mb-10 max-w-lg">Built for flooring, painting, and drywall. Every feature exists because a contractor needed it.</p>
          </FadeUp>

          {/* Top row: 2 big hero feature cards */}
          <div className="grid lg:grid-cols-3 gap-4 mb-4">
            <FadeUp className="lg:col-span-2">
              <div className="h-full rounded-2xl bg-slate-900 text-white p-7 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-blue-300 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-full">AI</span>
                </div>
                <h3 className="text-xl font-bold mb-2">AI Photo Estimates</h3>
                <p className="text-sm text-white/60 leading-relaxed flex-1">
                  Snap a photo of any room. AI identifies the space, calculates square footage, and generates a materials quote — before you leave the driveway. No LiDAR required. Works on any iPhone or iPad.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                  {["Photo → sqft", "Auto materials list", "Instant quote PDF"].map((f) => (
                    <div key={f} className="text-center">
                      <div className="text-xs font-semibold text-white/70">{f}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.06}>
              <div className="h-full rounded-2xl bg-blue-600 text-white p-7 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10H7V7zM4 4v4M4 16v4M20 4v4M20 16v4M4 4h4M16 4h4M4 20h4M16 20h4" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-blue-100 bg-white/20 px-2 py-0.5 rounded-full">LiDAR</span>
                </div>
                <h3 className="text-xl font-bold mb-2">LiDAR Room Scanner</h3>
                <p className="text-sm text-blue-100 leading-relaxed flex-1">
                  Scan any room with your iPhone Pro. Floor area, wall area, ceiling height — all with confidence ratings on every measurement. 8 view modes, 3D blueprint, AR overlay.
                </p>
                <div className="mt-5 pt-4 border-t border-white/20">
                  <p className="text-xs text-blue-200 font-medium">±0.5&quot; accuracy · Tape calibration mode</p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Lower grid: 10 feature cards, 5 cols × 2 rows on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {GRID_FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.03}>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group h-full">
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                      </svg>
                    </div>
                    {f.tag && (
                      <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full leading-none">{f.tag}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-xs mb-1 text-slate-900">{f.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp>
            <SectionLabel>What contractors say</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 text-slate-900">
              Built for the job site, <span className="text-blue-600">not the office.</span>
            </h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="flex flex-col h-full p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:border-blue-200 hover:shadow-md transition-all">
                  <div className="flex gap-1 mb-4">
                    {[0, 1, 2, 3, 4].map((j) => (
                      <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-200">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.trade} · {t.location}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PRICING ══════ */}
      <section className="py-16 px-6 md:px-12 bg-slate-50" id="pricing">
        <div className="max-w-[1000px] mx-auto">
          <FadeUp>
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-slate-900">Simple, honest pricing.</h2>
            <p className="text-slate-500 mb-10">Start free. Upgrade when it&apos;s making you money.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-5">
            {planOrder.map((planId, i) => {
              const plan = PLANS[planId];
              const isPro = planId === "pro";
              return (
                <FadeUp key={planId} delay={i * 0.1}>
                  <div className={`relative p-7 rounded-2xl border ${isPro ? "border-blue-500 border-2 bg-blue-600 text-white shadow-xl shadow-blue-200" : "border-slate-200 bg-white shadow-sm"}`}>
                    {isPro && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="text-[9px] font-bold uppercase tracking-[0.12em] bg-blue-600 text-white border border-blue-400 px-3 py-1 rounded-full">Most Popular</span>
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className={`text-base font-bold mb-2 ${isPro ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                      <span className={`text-4xl font-bold ${isPro ? "text-white" : "text-slate-900"}`}>${plan.price}</span>
                      {plan.price > 0 && <span className={`text-sm ${isPro ? "text-blue-200" : "text-slate-400"}`}>/mo</span>}
                      {plan.price > 0 && <p className={`text-xs mt-1 ${isPro ? "text-blue-200" : "text-slate-400"}`}>14-day free trial</p>}
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feat) => (
                        <li key={feat} className={`flex items-start gap-2.5 text-xs ${isPro ? "text-blue-100" : "text-slate-500"}`}>
                          <svg className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isPro ? "text-green-300" : "text-green-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup" className="block">
                      <Button className={`w-full h-10 text-sm font-semibold rounded-xl ${isPro ? "bg-white text-blue-700 hover:bg-blue-50" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                        {plan.price === 0 ? "Get Started Free" : "Start 14-Day Trial"}
                      </Button>
                    </Link>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section className="py-20 px-6 md:px-12 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />
        <FadeUp>
          <div className="max-w-xl mx-auto text-center relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Stop writing quotes by hand.</h2>
            <p className="text-blue-200 mb-10 text-lg">Every minute on paperwork is a minute you&apos;re not making money.</p>
            <Link href="/signup">
              <Button size="lg" className="px-10 h-12 text-sm font-semibold bg-white text-blue-700 hover:bg-blue-50 rounded-xl shadow-lg">
                Start Free — No Credit Card
              </Button>
            </Link>
            <p className="mt-5 text-xs text-blue-300 font-medium tracking-wider uppercase">
              Flooring · Painting · Drywall · More trades coming
            </p>
          </div>
        </FadeUp>
      </section>

      {/* ══════ CONTACT ══════ */}
      <section id="contact" className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp>
            <div className="text-center mb-10">
              <SectionLabel>Contact</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-slate-900">Questions? Get in touch.</h2>
              <p className="text-slate-500 max-w-md mx-auto">Demo, feature request, or team pricing — we&apos;re here.</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <ContactForm />
          </FadeUp>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="py-8 px-6 md:px-12 border-t border-slate-200 bg-white">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold text-slate-900">ProBuild<span className="text-blue-600">Calc</span></span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
            <Link href="/tools" className="hover:text-slate-700 transition-colors">Calculators</Link>
            <Link href="/blog" className="hover:text-slate-700 transition-colors">Guides</Link>
            <Link href="/for" className="hover:text-slate-700 transition-colors">Trades</Link>
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms</Link>
            <Link href="/login" className="hover:text-slate-700 transition-colors">Sign In</Link>
          </div>
          <span className="text-xs text-slate-400">&copy; {new Date().getFullYear()} ProBuildCalc</span>
        </div>
      </footer>
    </div>
  );
}
