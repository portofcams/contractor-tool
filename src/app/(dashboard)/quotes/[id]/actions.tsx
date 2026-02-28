"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QuoteActions({
  quoteId,
  currentStatus,
  customerEmail,
}: {
  quoteId: string;
  currentStatus: string;
  customerEmail?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailTo, setEmailTo] = useState(customerEmail || "");
  const [emailResult, setEmailResult] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  async function updateStatus(status: string) {
    setLoading(status);
    const extra: Record<string, string> = {};
    if (status === "sent") extra.sentAt = new Date().toISOString();
    if (status === "accepted") extra.acceptedAt = new Date().toISOString();

    await fetch(`/api/quotes/${quoteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...extra }),
    });

    router.refresh();
    setLoading("");
  }

  async function downloadPDF() {
    setLoading("pdf");
    try {
      const res = await fetch(`/api/quotes/${quoteId}/pdf`);
      if (!res.ok) throw new Error("PDF generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "") ||
        "quote.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
    }
    setLoading("");
  }

  async function sendEmail() {
    if (!emailTo) return;
    setLoading("email");
    setEmailResult({});

    try {
      const res = await fetch(`/api/quotes/${quoteId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailTo }),
      });

      const data = await res.json();

      if (res.ok) {
        setEmailResult({ success: true, message: `Quote sent to ${data.sentTo}` });
        router.refresh();
      } else {
        setEmailResult({ success: false, message: data.error || "Failed to send" });
      }
    } catch {
      setEmailResult({ success: false, message: "Network error" });
    }
    setLoading("");
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {/* PDF Download — always available */}
        <Button variant="outline" onClick={downloadPDF} disabled={!!loading}>
          {loading === "pdf" ? "Generating..." : "Download PDF"}
        </Button>

        {/* Email Quote — always available */}
        <Button
          variant="outline"
          onClick={() => {
            setEmailResult({});
            setEmailDialogOpen(true);
          }}
          disabled={!!loading}
        >
          Email Quote
        </Button>

        {/* Status actions */}
        {currentStatus === "draft" && (
          <Button onClick={() => updateStatus("sent")} disabled={!!loading}>
            {loading === "sent" ? "Updating..." : "Mark as Sent"}
          </Button>
        )}
        {(currentStatus === "draft" || currentStatus === "sent") && (
          <>
            <Button
              onClick={() => updateStatus("accepted")}
              disabled={!!loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading === "accepted" ? "Updating..." : "Mark Accepted"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateStatus("rejected")}
              disabled={!!loading}
            >
              {loading === "rejected" ? "Updating..." : "Mark Rejected"}
            </Button>
          </>
        )}
      </div>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="emailTo">Send to</Label>
              <Input
                id="emailTo"
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>
            {emailResult.message && (
              <div
                className={`text-sm p-3 rounded-md ${
                  emailResult.success
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {emailResult.message}
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setEmailDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={sendEmail}
                disabled={!emailTo || loading === "email"}
              >
                {loading === "email" ? "Sending..." : "Send Quote"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
