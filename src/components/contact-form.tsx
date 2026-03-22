"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-sm bg-white/[0.04] border border-white/[0.08] text-[#f5f0e8] placeholder:text-[#f5f0e8]/25 text-sm focus:outline-none focus:border-[#0a84ff]/40 focus:ring-1 focus:ring-[#0a84ff]/20 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name *"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
        <input
          type="email"
          placeholder="Email *"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
      </div>
      <input
        type="text"
        placeholder="Company (optional)"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        className={inputClass}
      />
      <textarea
        placeholder="How can we help? *"
        required
        rows={4}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={`${inputClass} resize-none`}
      />

      <div className="text-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center px-8 h-11 rounded-sm text-sm font-semibold bg-[#0a84ff] hover:bg-[#0a84ff]/90 text-white hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
      </div>

      {status === "sent" && (
        <p className="text-center text-sm text-[#30d158]">
          Message sent! We&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-[#ff453a]">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  );
}
