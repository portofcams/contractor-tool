"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/stripe";
import { ContactForm } from "@/components/contact-form";

// ── Animated counter hook ──
function useCounter(target: number, duration = 1500, suffix = "") {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
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
      },
      { threshold: 0.3 }
    );
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
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── Section label (CamDrop style) ──
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-6 h-px bg-[#0a84ff]" />
      <span className="text-xs font-mono font-medium tracking-[0.15em] uppercase text-[#0a84ff]">{children}</span>
    </div>
  );
}

const features = [
  { title: "AI Photo Estimates", desc: "Snap a photo of any room. AI calculates materials and generates a quote — before you leave the driveway.", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z", tag: "AI" },
  { title: "LiDAR Room Scanner", desc: "Scan any room with your iPhone Pro. Floor area, wall area, ceiling height — with confidence ratings on every measurement.", icon: "M7 7h10v10H7V7zM4 4v4M4 16v4M20 4v4M20 16v4M4 4h4M16 4h4M4 20h4M16 20h4", tag: "LiDAR" },
  { title: "8 View Modes", desc: "Floor plan, wall area, 3D blueprint, 3D render, point-to-point measure, PDF export, AR overlay, material preview.", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z", tag: null },
  { title: "Confidence Scoring", desc: "Every measurement gets a confidence rating — high, medium, or low — with ±inches. Know what to trust, what to verify.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", tag: "Exclusive" },
  { title: "Tape Calibration", desc: "Measure one wall with a tape, enter the number. Every other measurement auto-corrects — 60% more accurate. No other app does this.", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", tag: null },
  { title: "Inspection Reports", desc: "One tap generates a professional PDF — room measurements, material estimates, door/window details, confidence ratings.", icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z", tag: "New" },
  { title: "Voice-to-Quote", desc: "Walk a job site, dictate what you see. \"12x14 living room, hardwood, two coats.\" We turn it into a detailed quote.", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", tag: null },
  { title: "AR Material Preview", desc: "Show clients what hardwood, tile, or paint looks like in their actual room. Point your phone, see the finished result.", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", tag: null },
  { title: "Works Offline", desc: "Full functionality without cell service. Create quotes in basements, rural job sites, anywhere. Syncs when you're back online.", icon: "M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3", tag: null },
];

const planOrder = ["free", "pro", "business"] as const;

export default function LandingPage() {
  const stat1 = useCounter(60, 1200, "s");
  const stat2 = useCounter(8, 800, "");
  const stat3 = useCounter(100, 1500, "%");

  return (
    <div className="min-h-screen bg-[#060606] text-[#f5f0e8] overflow-hidden">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#060606]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-3.5 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Contractor<span className="text-[#0a84ff]">Calc</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-[#f5f0e8]/50 hover:text-[#f5f0e8] text-sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-sm px-5 text-sm bg-[#0a84ff] hover:bg-[#0a84ff]/90 hover:-translate-y-px transition-all">Try Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="relative pt-14 pb-20 md:pt-20 md:pb-28 px-5 md:px-12">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {/* Glow orb */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#0a84ff]/[0.06] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#5e5ce6]/[0.04] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative">
          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-sm bg-[#0a84ff]/[0.08] border border-[#0a84ff]/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#30d158] opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30d158]" />
              </span>
              <span className="text-[10px] md:text-xs font-mono tracking-wider uppercase text-[#0a84ff]">LiDAR Scanner + Confidence Scoring</span>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight max-w-3xl" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Quote any room
              <br />
              <span className="bg-gradient-to-r from-[#0a84ff] via-[#5e5ce6] to-[#bf5af2] bg-clip-text text-transparent">
                in 60 seconds.
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-6 text-lg md:text-xl text-[#f5f0e8]/50 max-w-xl leading-relaxed">
              Scan with LiDAR. Snap a photo. Dictate what you see.
              Professional quotes with exact measurements and materials — from the job site.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link href="/signup">
                <Button size="lg" className="rounded-sm px-8 h-12 text-sm font-semibold bg-[#0a84ff] hover:bg-[#0a84ff]/90 hover:-translate-y-px transition-all w-full sm:w-auto">
                  Start Free — No Credit Card
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="rounded-sm px-8 h-12 text-sm border-white/10 text-[#f5f0e8]/50 hover:text-[#f5f0e8] hover:border-white/20 w-full sm:w-auto">
                  See Features
                </Button>
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {["iPhone LiDAR scanning", "AI photo estimates", "Confidence scoring", "Works offline"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-[#f5f0e8]/40">
                  <svg className="w-4 h-4 text-[#30d158] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════ DEVICE MOCKUPS ══════ */}
      <section className="py-16 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a84ff]/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-[1200px] mx-auto relative">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">

              {/* iPhone mockup — Scanner */}
              <div className="relative group">
                <div className="w-[220px] h-[440px] md:w-[260px] md:h-[520px] rounded-[30px] md:rounded-[36px] bg-[#1c1c1e] border-[3px] border-[#3a3a3c] p-2.5 md:p-3 shadow-2xl shadow-black/50 group-hover:-translate-y-2 transition-transform duration-500">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-[#1c1c1e] rounded-b-2xl z-10" />
                  {/* Screen */}
                  <div className="w-full h-full rounded-[28px] bg-black overflow-hidden relative">
                    {/* Status bar */}
                    <div className="flex justify-between px-6 pt-3 pb-1 text-[9px] text-white/60 font-medium">
                      <span>9:41</span>
                      <div className="flex gap-1 items-center">
                        <div className="w-3.5 h-2 border border-white/40 rounded-sm relative">
                          <div className="absolute inset-[1px] right-[2px] bg-[#30d158] rounded-[1px]" />
                        </div>
                      </div>
                    </div>

                    {/* App content: Scanner page */}
                    <div className="px-4 pt-2">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-white text-base font-semibold">Room Scanner</p>
                          <p className="text-white/40 text-[9px]">LiDAR-powered measurement</p>
                        </div>
                      </div>

                      {/* Scan icon */}
                      <div className="flex flex-col items-center py-6">
                        <div className="w-16 h-16 rounded-2xl bg-[#0a84ff]/10 flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-[#0a84ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10H7V7zM4 4v4M4 16v4M20 4v4M20 16v4M4 4h4M16 4h4M4 20h4M16 20h4" />
                          </svg>
                        </div>

                        {/* Features */}
                        {["Floor & wall area", "Confidence scoring", "8 view modes", "Inspection report"].map((f, i) => (
                          <div key={i} className="flex items-center gap-2 w-full px-2 py-1.5">
                            <div className="w-4 h-4 rounded-full bg-[#0a84ff]/10 flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-[#0a84ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-white/70 text-[10px]">{f}</span>
                          </div>
                        ))}

                        {/* CTA button */}
                        <div className="w-full mt-4 py-3 bg-[#0a84ff] rounded-xl text-center">
                          <span className="text-white text-xs font-semibold">Start Room Scan</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom nav */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 px-2 pb-4 pt-1.5">
                      <div className="flex justify-around">
                        {["Home", "Scanner", "Quote", "Quotes", "Clients"].map((tab, i) => (
                          <div key={tab} className={`flex flex-col items-center gap-0.5 ${i === 1 ? "text-[#0a84ff]" : "text-white/30"}`}>
                            <div className="w-1 h-1 rounded-full bg-current" />
                            <span className="text-[7px] font-medium">{tab}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[10px] text-[#f5f0e8]/30 font-mono mt-3 uppercase tracking-wider">Room Scanner</p>
              </div>

              {/* iPhone mockup — Scan Results */}
              <div className="relative group hidden md:block">
                <div className="w-[260px] h-[520px] rounded-[36px] bg-[#1c1c1e] border-[3px] border-[#3a3a3c] p-3 shadow-2xl shadow-black/50 group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-[#1c1c1e] rounded-b-2xl z-10" />
                  <div className="w-full h-full rounded-[28px] bg-black overflow-hidden relative">
                    <div className="flex justify-between px-6 pt-3 pb-1 text-[9px] text-white/60 font-medium">
                      <span>9:41</span>
                      <div className="flex gap-1 items-center">
                        <div className="w-3.5 h-2 border border-white/40 rounded-sm relative">
                          <div className="absolute inset-[1px] right-[2px] bg-[#30d158] rounded-[1px]" />
                        </div>
                      </div>
                    </div>

                    {/* Scan results */}
                    <div className="px-4 pt-2">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white text-lg font-semibold">1,248 sqft</p>
                          <p className="text-white/40 text-[9px]">3 rooms &middot; 4 walls &middot; 2 doors</p>
                        </div>
                        <div className="px-2 py-1 rounded bg-white/10 text-[8px] text-white/50">Rescan</div>
                      </div>

                      {/* Mode pills */}
                      <div className="flex gap-1 mb-3 overflow-hidden">
                        {["Floor", "Walls", "3D", "Render", "Measure"].map((m, i) => (
                          <div key={m} className={`px-2.5 py-1 rounded-full text-[8px] font-medium whitespace-nowrap ${i === 0 ? "bg-[#0a84ff] text-white" : "bg-white/5 text-white/40"}`}>
                            {m}
                          </div>
                        ))}
                      </div>

                      {/* Room cards */}
                      {[
                        { name: "Living Room", sqft: 520, dims: "20' x 26'", conf: "high", acc: "±0.5\"" },
                        { name: "Kitchen", sqft: 380, dims: "16' x 24'", conf: "high", acc: "±0.8\"" },
                        { name: "Bedroom", sqft: 348, dims: "14.5' x 24'", conf: "medium", acc: "±1.5\"" },
                      ].map((room, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white text-[10px] font-medium">{room.name}</p>
                              <p className="text-white/30 text-[8px]">{room.dims} &middot; {room.sqft} sqft</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`px-1.5 py-0.5 rounded text-[6px] font-bold uppercase ${room.conf === "high" ? "bg-[#30d158]/15 text-[#30d158]" : "bg-[#ff9500]/15 text-[#ff9500]"}`}>
                                {room.conf}
                              </span>
                              <span className="text-white/40 text-[8px]">{room.acc}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Confidence summary */}
                      <div className="mt-3 p-2.5 rounded-lg bg-[#30d158]/[0.06] border border-[#30d158]/20">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8">
                            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                              <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                              <circle cx="16" cy="16" r="13" fill="none" stroke="#30d158" strokeWidth="3" strokeDasharray="81.68" strokeDashoffset="14.7" strokeLinecap="round" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-white">82</span>
                          </div>
                          <div>
                            <p className="text-[#30d158] text-[8px] font-semibold">High Confidence</p>
                            <p className="text-white/30 text-[7px]">Ready to use &middot; 92% coverage</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom nav */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 px-2 pb-4 pt-1.5">
                      <div className="flex justify-around">
                        {["Home", "Scanner", "Quote", "Quotes", "Clients"].map((tab, i) => (
                          <div key={tab} className={`flex flex-col items-center gap-0.5 ${i === 1 ? "text-[#0a84ff]" : "text-white/30"}`}>
                            <div className="w-1 h-1 rounded-full bg-current" />
                            <span className="text-[7px] font-medium">{tab}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[10px] text-[#f5f0e8]/30 font-mono mt-3 uppercase tracking-wider">Scan Results</p>
              </div>

              {/* iPhone mockup — Quote PDF */}
              <div className="relative group hidden lg:block">
                <div className="w-[260px] h-[520px] rounded-[36px] bg-[#1c1c1e] border-[3px] border-[#3a3a3c] p-3 shadow-2xl shadow-black/50 group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-[#1c1c1e] rounded-b-2xl z-10" />
                  <div className="w-full h-full rounded-[28px] bg-black overflow-hidden relative">
                    <div className="flex justify-between px-6 pt-3 pb-1 text-[9px] text-white/60 font-medium">
                      <span>9:42</span>
                      <div className="flex gap-1 items-center">
                        <div className="w-3.5 h-2 border border-white/40 rounded-sm relative">
                          <div className="absolute inset-[1px] right-[2px] bg-[#30d158] rounded-[1px]" />
                        </div>
                      </div>
                    </div>

                    {/* Quote view */}
                    <div className="px-4 pt-2">
                      <p className="text-white/40 text-[9px] mb-1">Quote #QT-0042</p>
                      <p className="text-white text-sm font-semibold mb-0.5">Johnson Residence</p>
                      <p className="text-white/30 text-[9px] mb-3">Hardwood Flooring &middot; 1,248 sqft</p>

                      {/* Materials */}
                      <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] overflow-hidden mb-3">
                        <div className="bg-[#0a84ff]/10 px-2.5 py-1.5">
                          <p className="text-[8px] font-bold text-[#0a84ff] uppercase tracking-wider">Materials</p>
                        </div>
                        {[
                          { item: "Oak Hardwood", qty: "1,348 sqft", cost: "$8,088" },
                          { item: "Underlayment", qty: "1,348 sqft", cost: "$674" },
                          { item: "Transitions", qty: "6 pcs", cost: "$180" },
                          { item: "Installation Labor", qty: "1,248 sqft", cost: "$4,992" },
                        ].map((m, i) => (
                          <div key={i} className={`flex justify-between px-2.5 py-1.5 text-[8px] ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                            <div>
                              <span className="text-white/70">{m.item}</span>
                              <span className="text-white/25 ml-1.5">{m.qty}</span>
                            </div>
                            <span className="text-white/50 font-mono">{m.cost}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0a84ff]/[0.06] border border-[#0a84ff]/20">
                        <span className="text-white text-xs font-semibold">Total</span>
                        <span className="text-[#0a84ff] text-lg font-bold font-mono">$16,248</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <div className="flex-1 py-2 bg-[#0a84ff] rounded-lg text-center">
                          <span className="text-white text-[9px] font-semibold">Email Quote</span>
                        </div>
                        <div className="flex-1 py-2 bg-white/10 rounded-lg text-center">
                          <span className="text-white/70 text-[9px] font-semibold">Download PDF</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2 mt-3 px-2">
                        <span className="px-2 py-0.5 rounded bg-[#ff9500]/15 text-[#ff9500] text-[7px] font-bold uppercase">Sent</span>
                        <span className="text-white/25 text-[7px]">Waiting for response</span>
                      </div>
                    </div>

                    {/* Bottom nav */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 px-2 pb-4 pt-1.5">
                      <div className="flex justify-around">
                        {["Home", "Scanner", "Quote", "Quotes", "Clients"].map((tab, i) => (
                          <div key={tab} className={`flex flex-col items-center gap-0.5 ${i === 3 ? "text-[#0a84ff]" : "text-white/30"}`}>
                            <div className="w-1 h-1 rounded-full bg-current" />
                            <span className="text-[7px] font-medium">{tab}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[10px] text-[#f5f0e8]/30 font-mono mt-3 uppercase tracking-wider">Professional Quotes</p>
              </div>

            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="py-12 px-6 md:px-12 border-y border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div ref={stat1.ref}>
            <p className="text-3xl md:text-4xl font-bold text-[#0a84ff] font-mono">{stat1.value}</p>
            <p className="text-xs text-[#f5f0e8]/40 mt-1.5 font-mono tracking-wider uppercase">Avg quote time</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-[#0a84ff] font-mono">±0.5&quot;</p>
            <p className="text-xs text-[#f5f0e8]/40 mt-1.5 font-mono tracking-wider uppercase">LiDAR accuracy</p>
          </div>
          <div ref={stat2.ref}>
            <p className="text-3xl md:text-4xl font-bold text-[#0a84ff] font-mono">{stat2.value}</p>
            <p className="text-xs text-[#f5f0e8]/40 mt-1.5 font-mono tracking-wider uppercase">Scan view modes</p>
          </div>
          <div ref={stat3.ref}>
            <p className="text-3xl md:text-4xl font-bold text-[#0a84ff] font-mono">{stat3.value}</p>
            <p className="text-xs text-[#f5f0e8]/40 mt-1.5 font-mono tracking-wider uppercase">Offline capable</p>
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="py-20 px-6 md:px-12 bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp>
            <SectionLabel>Process</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Scan. Review. <span className="bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6] bg-clip-text text-transparent">Send.</span>
            </h2>
            <p className="text-[#f5f0e8]/40 mb-16 max-w-lg">
              No spreadsheets. No driving back to the office. Quote on-site, close on-site.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Scan the Room", desc: "Point your iPhone at the room. LiDAR maps every wall, door, and window. Real-time coaching guides you — \"move closer\", \"scan the last wall\", \"looking great.\"" },
              { step: "02", title: "Review & Calibrate", desc: "See measurements with confidence scores. Tape one wall to calibrate everything else. 8 view modes — floor plan, 3D blueprint, wall area, point measure, AR overlay." },
              { step: "03", title: "Quote & Send", desc: "Pick materials from your price book. Generate a branded PDF with inspection report. Email or share a link — customer reviews, e-signs, done." },
            ].map((s, i) => (
              <FadeUp key={s.step} delay={i * 0.1}>
                <div className="relative">
                  <span className="text-5xl font-bold text-[#0a84ff]/10 font-mono">{s.step}</span>
                  <h3 className="text-lg font-semibold mt-2 mb-2">{s.title}</h3>
                  <p className="text-sm text-[#f5f0e8]/40 leading-relaxed">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ LIDAR SPOTLIGHT ══════ */}
      <section className="py-20 px-6 md:px-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#5e5ce6]/[0.04] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative">
          <FadeUp>
            <SectionLabel>LiDAR Technology</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Better than <span className="bg-gradient-to-r from-[#0a84ff] to-[#bf5af2] bg-clip-text text-transparent">Polycam.</span>
            </h2>
            <p className="text-[#f5f0e8]/40 mb-12 max-w-lg">
              Other apps give you a 3D model. We give you actionable data — sqft, paint gallons, drywall sheets, and a confidence score.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Confidence scoring", desc: "Every measurement rated high/medium/low with ±inches. Know what to trust." },
              { title: "Tape calibration", desc: "Measure one wall by hand. All other measurements auto-correct — 60% more accurate." },
              { title: "Multi-scan averaging", desc: "Scan 2-3 times. We average results and flag disagreements." },
              { title: "Real-time coaching", desc: "\"Move closer.\" \"Almost there.\" \"Looking great!\" Guided scanning for better data." },
              { title: "Smart recommendations", desc: "\"Room 1 is large — verify longest dimension.\" We tell you what to check." },
              { title: "Inspection reports", desc: "Professional PDF from one tap. Measurements, estimates, confidence. Attach to any quote." },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.05}>
                <div className="p-5 rounded-sm bg-white/[0.02] border border-white/[0.06] hover:border-[#0a84ff]/30 transition-all hover:-translate-y-px">
                  <h3 className="font-semibold text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-[#f5f0e8]/40 leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section className="py-20 px-6 md:px-12 bg-[#0a0a0a]" id="features">
        <div className="max-w-[1200px] mx-auto">
          <FadeUp>
            <SectionLabel>Capabilities</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need. <span className="text-[#f5f0e8]/30">Nothing you don&apos;t.</span>
            </h2>
            <p className="text-[#f5f0e8]/40 mb-16 max-w-lg">
              Built for flooring, painting, and drywall. Every feature exists because a contractor needed it.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.04}>
                <div className="p-5 rounded-sm bg-white/[0.02] border border-white/[0.06] hover:border-[#0a84ff]/30 transition-all hover:-translate-y-px group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-sm bg-[#0a84ff]/[0.08] flex items-center justify-center group-hover:bg-[#0a84ff]/[0.12] transition-colors">
                      <svg className="w-5 h-5 text-[#0a84ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                      </svg>
                    </div>
                    {f.tag && (
                      <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.12em] text-[#0a84ff] bg-[#0a84ff]/[0.08] px-2 py-0.5 rounded-sm">{f.tag}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-[#f5f0e8]/40 leading-relaxed">{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PRICING ══════ */}
      <section className="py-20 px-6 md:px-12" id="pricing">
        <div className="max-w-[1000px] mx-auto">
          <FadeUp>
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Simple, honest pricing.
            </h2>
            <p className="text-[#f5f0e8]/40 mb-12">Start free. Upgrade when it&apos;s making you money.</p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-5">
            {planOrder.map((planId, i) => {
              const plan = PLANS[planId];
              const isPro = planId === "pro";
              return (
                <FadeUp key={planId} delay={i * 0.1}>
                  <div className={`relative p-6 rounded-sm border ${isPro ? "border-[#0a84ff] border-2 bg-[#0a84ff]/[0.03]" : "border-white/[0.06] bg-white/[0.02]"}`}>
                    {isPro && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.15em] bg-[#0a84ff] text-white px-3 py-1 rounded-sm">Most Popular</span>
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-base font-semibold mb-2">{plan.name}</h3>
                      <span className="text-4xl font-bold font-mono">${plan.price}</span>
                      {plan.price > 0 && <span className="text-[#f5f0e8]/40 text-sm">/mo</span>}
                      {plan.price > 0 && <p className="text-xs text-[#f5f0e8]/25 mt-1">14-day free trial</p>}
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-xs text-[#f5f0e8]/50">
                          <svg className="w-3.5 h-3.5 text-[#30d158] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup" className="block">
                      <Button className={`w-full rounded-sm h-10 text-sm hover:-translate-y-px transition-all ${isPro ? "bg-[#0a84ff] hover:bg-[#0a84ff]/90" : "bg-white/[0.06] hover:bg-white/[0.1] text-[#f5f0e8] border-0"}`}>
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

      {/* ══════ CONTACT ══════ */}
      <section id="contact" className="py-24 px-6 md:px-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5e5ce6]/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-[1200px] mx-auto relative">
          <FadeUp>
            <div className="text-center mb-12">
              <SectionLabel>Contact</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Questions? Get in touch.
              </h2>
              <p className="text-base text-[#f5f0e8]/40 max-w-md mx-auto">
                Whether you need a demo, have a feature request, or want to talk pricing for your team — we&apos;re here.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <ContactForm />
          </FadeUp>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section className="py-24 px-6 md:px-12 relative bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a84ff]/[0.04] to-transparent pointer-events-none" />
        <FadeUp>
          <div className="max-w-xl mx-auto text-center relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Stop writing quotes by hand.
            </h2>
            <p className="text-base text-[#f5f0e8]/40 mb-10">
              Every minute on paperwork is a minute you&apos;re not making money.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-sm px-10 h-12 text-sm font-semibold bg-[#0a84ff] hover:bg-[#0a84ff]/90 hover:-translate-y-px transition-all">
                Start Free — No Credit Card
              </Button>
            </Link>
            <p className="mt-5 text-[10px] text-[#f5f0e8]/25 font-mono tracking-wider uppercase">
              Flooring &middot; Painting &middot; Drywall &middot; More trades coming
            </p>
          </div>
        </FadeUp>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="py-8 px-6 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#f5f0e8]/25 font-mono">&copy; {new Date().getFullYear()} ProBuildCalc</span>
          <div className="flex gap-6 text-xs text-[#f5f0e8]/25">
            <Link href="/privacy" className="hover:text-[#f5f0e8]/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#f5f0e8]/60 transition-colors">Terms</Link>
            <Link href="/login" className="hover:text-[#f5f0e8]/60 transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
