"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReviewData {
  id: string;
  companyName: string;
  trade: string;
  customerName: string;
  rating: number | null;
  comment: string | null;
  submittedAt: string | null;
}

export default function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/reviews/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setReview(data);
          if (data.submittedAt) setSubmitted(true);
          if (data.rating) setRating(data.rating);
          if (data.comment) setComment(data.comment);
        }
      })
      .catch(() => setError("Failed to load review"))
      .finally(() => setLoading(false));
  }, [token]);

  async function submitReview() {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment || null }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit");
      }
    } catch {
      setError("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error && !review) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!review) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{review.companyName}</CardTitle>
          <p className="text-sm text-muted-foreground capitalize">
            {review.trade} Services
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {submitted ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">
                {"★".repeat(rating)}
                {"☆".repeat(5 - rating)}
              </div>
              <p className="text-lg font-medium text-green-600 mb-2">
                Thank you for your review!
              </p>
              {comment && (
                <p className="text-sm text-muted-foreground italic">
                  &ldquo;{comment}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Hi {review.customerName}, how would you rate your experience?
                </p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-4xl cursor-pointer transition-transform hover:scale-110"
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    >
                      {star <= (hoverRating || rating) ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="review-comment" className="text-sm text-muted-foreground block mb-1">
                  Comments (optional)
                </label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Tell us about your experience..."
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                onClick={submitReview}
                disabled={rating === 0 || submitting}
                className="w-full"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
