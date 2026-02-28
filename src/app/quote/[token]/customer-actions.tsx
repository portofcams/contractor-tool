"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomerActions({
  token,
  currentStatus,
  hasSignature,
}: {
  token: string;
  currentStatus: string;
  hasSignature: boolean;
}) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string }>({});

  // If already accepted/rejected, show status
  if (currentStatus === "accepted") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6 text-center">
          <div className="text-3xl mb-2">&#10003;</div>
          <p className="text-green-700 font-semibold text-lg">
            Quote Accepted
          </p>
          <p className="text-green-600 text-sm mt-1">
            Thank you for your business!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (currentStatus === "rejected") {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6 text-center">
          <p className="text-red-700 font-semibold text-lg">Quote Declined</p>
          <p className="text-red-600 text-sm mt-1">
            This quote has been declined.
          </p>
        </CardContent>
      </Card>
    );
  }

  function getCanvasPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    setHasDrawn(true);
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getCanvasPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1e40af";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  function stopDraw() {
    setIsDrawing(false);
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }

  async function handleAction(action: "accept" | "decline") {
    setLoading(action);
    setResult({});

    let signatureData: string | undefined;
    if (action === "accept" && canvasRef.current && hasDrawn) {
      signatureData = canvasRef.current.toDataURL("image/png");
    }

    try {
      const res = await fetch(`/api/quote/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, signatureData }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          success: true,
          message:
            action === "accept"
              ? "Quote accepted! Thank you."
              : "Quote has been declined.",
        });
        router.refresh();
      } else {
        setResult({ success: false, message: data.error || "Something went wrong" });
      }
    } catch {
      setResult({ success: false, message: "Network error" });
    }
    setLoading("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Response</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Please review the quote above and accept or decline below.
        </p>

        {result.message && (
          <div
            className={`text-sm p-3 rounded-md ${
              result.success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {result.message}
          </div>
        )}

        {!showSignature ? (
          <div className="flex gap-3">
            <Button
              onClick={() => setShowSignature(true)}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!!loading}
            >
              Accept Quote
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleAction("decline")}
              className="flex-1"
              disabled={!!loading}
            >
              {loading === "decline" ? "Declining..." : "Decline"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Sign below to accept this quote:
            </p>
            <div className="border rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={500}
                height={150}
                className="w-full cursor-crosshair touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSignature}
              >
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSignature(false);
                  clearSignature();
                }}
              >
                Cancel
              </Button>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => handleAction("accept")}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!hasDrawn || !!loading}
              >
                {loading === "accept"
                  ? "Accepting..."
                  : "Sign & Accept Quote"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
