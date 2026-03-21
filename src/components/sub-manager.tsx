"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Subcontractor {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  trade: string;
  licenseNumber: string | null;
  insuranceExpiry: string | null;
  hourlyRate: number | null;
  rating: number | null;
  notes: string | null;
  active: boolean;
}

interface Bid {
  id: string;
  subcontractorId: string;
  phaseId: string;
  amount: number;
  description: string | null;
  status: string;
  estimatedDays: number | null;
  submittedAt: string;
  subcontractor: { companyName: string; trade: string };
  phase: { name: string };
}

const TRADES = ["plumbing", "electrical", "hvac", "roofing", "concrete", "masonry", "carpentry", "painting", "landscaping", "flooring", "drywall", "insulation", "demolition", "other"];

const BID_STATUS_COLORS: Record<string, string> = {
  pending: "bg-purple-500/15 text-purple-500",
  accepted: "bg-green-500/15 text-green-500",
  rejected: "bg-red-500/15 text-red-500",
  expired: "bg-gray-500/15 text-gray-500",
};

export function SubManager({ projectId, phases }: { projectId?: string; phases?: { id: string; name: string }[] }) {
  const [subs, setSubs] = useState<Subcontractor[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showBidForm, setShowBidForm] = useState<string | null>(null);
  const [editingSub, setEditingSub] = useState<Subcontractor | null>(null);
  const [filterTrade, setFilterTrade] = useState("");
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({ companyName: "", contactName: "", email: "", phone: "", trade: "plumbing", licenseNumber: "", insuranceExpiry: "", hourlyRate: "", rating: "", notes: "" });
  const [bidForm, setBidForm] = useState({ phaseId: "", amount: "", description: "", estimatedDays: "", notes: "" });

  useEffect(() => {
    loadData();
  }, [filterTrade]);

  async function loadData() {
    setLoading(true);
    const url = filterTrade ? `/api/subcontractors?trade=${filterTrade}` : "/api/subcontractors";
    const res = await fetch(url);
    setSubs(await res.json());
    if (projectId) {
      const bidRes = await fetch(`/api/projects/${projectId}/bids`);
      setBids(await bidRes.json());
    }
    setLoading(false);
  }

  async function saveSub(e: React.FormEvent) {
    e.preventDefault();
    const url = editingSub ? `/api/subcontractors/${editingSub.id}` : "/api/subcontractors";
    await fetch(url, {
      method: editingSub ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setEditingSub(null);
    setForm({ companyName: "", contactName: "", email: "", phone: "", trade: "plumbing", licenseNumber: "", insuranceExpiry: "", hourlyRate: "", rating: "", notes: "" });
    loadData();
  }

  async function submitBid(e: React.FormEvent) {
    e.preventDefault();
    if (!showBidForm) return;
    await fetch(`/api/subcontractors/${showBidForm}/bids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bidForm),
    });
    setShowBidForm(null);
    setBidForm({ phaseId: "", amount: "", description: "", estimatedDays: "", notes: "" });
    loadData();
  }

  async function updateBidStatus(bidId: string, status: string) {
    if (!projectId) return;
    await fetch(`/api/projects/${projectId}/bids/${bidId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadData();
  }

  function startEdit(sub: Subcontractor) {
    setEditingSub(sub);
    setForm({
      companyName: sub.companyName,
      contactName: sub.contactName || "",
      email: sub.email || "",
      phone: sub.phone || "",
      trade: sub.trade,
      licenseNumber: sub.licenseNumber || "",
      insuranceExpiry: sub.insuranceExpiry?.split("T")[0] || "",
      hourlyRate: sub.hourlyRate?.toString() || "",
      rating: sub.rating?.toString() || "",
      notes: sub.notes || "",
    });
    setShowForm(true);
  }

  function renderStars(rating: number | null) {
    if (!rating) return null;
    return (
      <span className="text-yellow-500 text-xs">
        {"★".repeat(rating)}{"☆".repeat(5 - rating)}
      </span>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select value={filterTrade} onChange={(e) => setFilterTrade(e.target.value)} className="px-3 py-2 rounded-md border border-border bg-background text-sm">
            <option value="">All trades</option>
            {TRADES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <Button onClick={() => { setEditingSub(null); setShowForm(true); setForm({ companyName: "", contactName: "", email: "", phone: "", trade: "plumbing", licenseNumber: "", insuranceExpiry: "", hourlyRate: "", rating: "", notes: "" }); }}>
          + Add Subcontractor
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle>{editingSub ? "Edit" : "Add"} Subcontractor</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={saveSub} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Company Name *</label>
                  <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" required />
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Name</label>
                  <input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Trade *</label>
                  <select value={form.trade} onChange={(e) => setForm({ ...form, trade: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm">
                    {TRADES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Hourly Rate</label>
                  <input type="number" step="0.01" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} placeholder="$0.00" className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">License #</label>
                  <input value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Insurance Expiry</label>
                  <input type="date" value={form.insuranceExpiry} onChange={(e) => setForm({ ...form, insuranceExpiry: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} type="button" onClick={() => setForm({ ...form, rating: r.toString() })} className={`text-xl ${parseInt(form.rating) >= r ? "text-yellow-500" : "text-gray-500"}`}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingSub ? "Update" : "Add"}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingSub(null); }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Subs list */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-secondary rounded-lg" />)}
        </div>
      ) : subs.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No subcontractors yet.</p>
      ) : (
        <div className="space-y-3">
          {subs.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{sub.companyName}</h3>
                      <Badge variant="secondary">{sub.trade}</Badge>
                      {renderStars(sub.rating)}
                    </div>
                    {sub.contactName && <p className="text-sm text-muted-foreground">{sub.contactName}</p>}
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      {sub.phone && <span>{sub.phone}</span>}
                      {sub.email && <span>{sub.email}</span>}
                      {sub.hourlyRate && <span>${sub.hourlyRate}/hr</span>}
                    </div>
                    {sub.insuranceExpiry && (
                      <p className={`text-xs mt-1 ${new Date(sub.insuranceExpiry) < new Date() ? "text-red-500" : "text-muted-foreground"}`}>
                        Insurance: {new Date(sub.insuranceExpiry).toLocaleDateString()}
                        {new Date(sub.insuranceExpiry) < new Date() && " (EXPIRED)"}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => startEdit(sub)}>Edit</Button>
                    {projectId && phases && phases.length > 0 && (
                      <Button size="sm" variant="outline" onClick={() => { setShowBidForm(sub.id); setBidForm({ phaseId: phases[0].id, amount: "", description: "", estimatedDays: "", notes: "" }); }}>+ Bid</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bid form */}
      {showBidForm && phases && (
        <Card className="border-primary/30">
          <CardHeader><CardTitle>Submit Bid</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submitBid} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Phase</label>
                  <select value={bidForm.phaseId} onChange={(e) => setBidForm({ ...bidForm, phaseId: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm">
                    {phases.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Bid Amount ($)</label>
                  <input type="number" step="0.01" value={bidForm.amount} onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea value={bidForm.description} onChange={(e) => setBidForm({ ...bidForm, description: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium">Estimated Days</label>
                <input type="number" value={bidForm.estimatedDays} onChange={(e) => setBidForm({ ...bidForm, estimatedDays: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Submit Bid</Button>
                <Button type="button" variant="outline" onClick={() => setShowBidForm(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Bids list */}
      {projectId && bids.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Bids</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bids.map((bid) => (
                <div key={bid.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{bid.subcontractor.companyName}</span>
                      <Badge className={BID_STATUS_COLORS[bid.status]}>{bid.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{bid.phase.name} — ${bid.amount.toLocaleString()}{bid.estimatedDays ? ` · ${bid.estimatedDays} days` : ""}</p>
                    {bid.description && <p className="text-xs text-muted-foreground mt-1">{bid.description}</p>}
                  </div>
                  {bid.status === "pending" && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" onClick={() => updateBidStatus(bid.id, "accepted")}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => updateBidStatus(bid.id, "rejected")}>Reject</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
